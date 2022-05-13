import { Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import Member from "../../../database/member/Member";
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

        const membersOnTheServer = await Member.find({
            where: {
                alwaysInTheServer: true
            }
        });

        const inactivesOnTheServer = inactives.filter(
            member => membersOnTheServer.find(memberOnTheServer => memberOnTheServer.userId === member.userId)
        );

        if(inactivesOnTheServer.length){
            Client.instance.embed.sendSimple(
                "**__Liste des membres inactif__**\n\n" + inactivesOnTheServer.map(element => "<@" + element.userId + ">").join(", ") + ".", 
                <TextChannel>message.channel
            );
        } else {
            Client.instance.embed.sendSimple("Aucun membre n'est inactif.", <TextChannel>message.channel);
        }
    }
}