import { getBirthdays, GetBirthdaysType } from "$core/api/requests/Member";
import Task from "$core/tasks/Task";
import { generalChannel } from "$resources/config/information.json";
import { BaseGuildTextChannel } from "discord.js";
import Client from "$core/Client";
import { simpleEmbed } from "$core/utils/Embed";
import DayJS from "$core/utils/DayJS";
import { msg } from "$core/utils/Message";
import { gqlRequest } from "$core/utils/Request";

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

    public async run(): Promise<void> {
        // Check if time (00:00) :
        const currentDate = DayJS().tz();

        if (currentDate.hour() !== 0 || currentDate.minute() !== 0) return;

        // Check birthdays of the day :
        const birthdays = (await gqlRequest<GetBirthdaysType, undefined>(getBirthdays)).data?.members.filter(member => {
            if (!member.birthday) return false;

            const birthday = DayJS(member.birthday).tz();

            return birthday.date() === currentDate.date()
                && birthday.month() === currentDate.month();
        });

        if (!birthdays) return;

        // Send birthday message :
        if (birthdays.length) {
            const generalChannelInstance = await (await Client.instance.getGuild()).channels.fetch(generalChannel);

            if (!(generalChannelInstance instanceof BaseGuildTextChannel)) return;

            for (const member of birthdays) {
                if (!member.birthday) continue;

                const message = this.messages[Math.floor(Math.random() * this.messages.length)];
                const birthday = DayJS(member.birthday).tz();

                const embed = simpleEmbed(message.text.replace("{MENTION}", `<@${member._id}>`), "normal", message.title)
                    .setThumbnail(member.profilePicture)
                    .setFooter({ text: msg("task-birthdayschecker-exec-embed-footer", [currentDate.year() - birthday.year()]) });

                generalChannelInstance.send({ embeds: [embed] });
            }
        }
    }
}