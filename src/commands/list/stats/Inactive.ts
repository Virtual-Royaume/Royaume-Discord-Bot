import { GuildMember, Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import MemberActivity from "../../../database/member/MemberActivity";
import Command from "../../Command";

export default class Inactive extends Command {

    constructor(){
        super(
            "inactive",
            "Voir les membres inactifs ce mois-ci",
            "statistiques"
        );
    }

    public async run(args: any[], message: Message) : Promise<void> {
        const inactives = await MemberActivity.find({
            where: {
                monthMessageCount: 0
            },
            take: 30
        });

        if(inactives.length){
            Client.instance.embed.sendSimple(
                "**__Liste des membres inactif__**\n\n" + inactives.map(element => "<@" + element.userId + ">").join(", ") + ".", 
                <TextChannel>message.channel
            );
        } else {
            Client.instance.embed.sendSimple("Aucun membre n'est inactif.", <TextChannel>message.channel);
        }
    }
}