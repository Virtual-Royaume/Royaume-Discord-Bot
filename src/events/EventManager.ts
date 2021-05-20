import Client from "../client/Client";

import GuildMemberAdd from "./list/GuildMemberAdd";
import Message from "./list/Message";

export default class EventManager {

    constructor(){
        Client.instance.logger.info(`=-=-=-=-=-=-=- Loading event(s) -=-=-=-=-=-=-=`);
        Client.instance.on("guildMemberAdd", guildMember => (new GuildMemberAdd()).run(guildMember));
        Client.instance.on("message", message => (new Message()).run(message));
    }
}