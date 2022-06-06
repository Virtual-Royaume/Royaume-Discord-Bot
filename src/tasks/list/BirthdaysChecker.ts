import { request } from "../../api/Request";
import { getBirthdays, GetBirthdaysType } from "../../api/requests/Member";
import Task from "../Task";
import { generalChannel } from "../../../resources/config/information.json";
import { BaseGuildTextChannel } from "discord.js";
import Client from "../../Client";
import { simpleEmbed } from "../../utils/Embed";

export default class ServerActivityUpdate extends Task {

    private readonly messages = [
        {
            title: "SURPRISE !!",
            text: "Aujourd'hui est un jour spécial pour {MENTION} !!!!"
        },
        {
            title: "QUOI ???",
            text: "Feur ! C'est l'anniversaire de {MENTION}."
        },
        {
            title: "WOWWW",
            text: "Bon anniversaire {MENTION} !! 🎁🎉"
        }
    ];

    constructor() {
        super(60_000);
    }

    public async run() : Promise<void> {
        // Check if time (00:00) :
        const currentDate = new Date();

        if (currentDate.getHours() !== 0 || currentDate.getMinutes() !== 0) return;

        // Check birthdays of the day :
        const birthdays = (await request<GetBirthdaysType>(getBirthdays)).members.filter(member => {
            if (!member.birthday) return false;

            const birthday = new Date(member.birthday);

            return birthday.getDate() === currentDate.getDate()
                && birthday.getMonth() === currentDate.getMonth();
        });

        // Send birthday message :
        if (birthdays.length) {
            const generalChannelInstance = await (await Client.instance.getGuild()).channels.fetch(generalChannel);

            if (!(generalChannelInstance instanceof BaseGuildTextChannel)) return;

            for (const member of birthdays) {
                const message = this.messages[Math.floor(Math.random() * this.messages.length)];
                const birthday = new Date(member.birthday ?? 1);

                const embed = simpleEmbed(message.text.replace("{MENTION}", `<@${member._id}>`), "normal", message.title)
                    .setThumbnail(member.profilePicture)
                    .setFooter({ text: `${currentDate.getFullYear() - birthday.getFullYear()} années de vie sur terre` });

                generalChannelInstance.send({ embeds: [embed] });
            }
        }
    }
}