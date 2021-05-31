import { Message } from "discord.js";
import Client from "../../../client/Client";
import Command from "../../Command";
import AppDiscord from "./../../../constants/AppDiscord";

export default class Youtube extends Command {

    constructor(){
        super(
            "fishington",
            "Permet de jouer à fishington ensemble",
            "games"
        );
    }

    public async run(args: any[], message: Message) {
      if (!message.member?.voice.channelID) {
        Client.instance.embed.sendSimple(
          "Vous devez être dans un salon vocal !",
          message.channel
        );
        return;
      };

      const instance: any = Client.instance;

      instance.api
        .channels(message.member.voice.channelID)
        .invites.post({
          data: {
            temporary: true,
            max_age: 7200, // 2h
            max_uses: 0,
            unique: true,
            target_type: 2,
            target_application_id: AppDiscord.fishington,
          }
        })
        .then((invite: {code: string}): void => {
          Client.instance.embed.sendSimple(
            `Rejoignez l'activité en cliquant sur le lien\nhttps://discord.gg/${invite.code}`,
            message.channel
          )
        });
    }
}