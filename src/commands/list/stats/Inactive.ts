import { Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import Member from "../../../database/src/models/Member";
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
        const inactives = await Member.MemberModel.find({"activity.monthMessageCount": 0, alwaysInTheServer: true}).limit(30).exec();

        if(inactives.length){
            Client.instance.embed.sendSimple(
                "**__Liste des membres inactif__**\n\n" + inactives.map(element => "<@" + element._id + ">").join(", ") + ".", 
                <TextChannel>message.channel
            );
        } else {
            Client.instance.embed.sendSimple("Aucun membre n'est inactif.", <TextChannel>message.channel);
        }
    }
}