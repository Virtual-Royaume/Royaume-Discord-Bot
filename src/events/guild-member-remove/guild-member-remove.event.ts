import { EnableInDev } from "$core/utils/handler";
import { EventExecute, EventName } from "$core/utils/handler/event";

export const enableInDev: EnableInDev = true;

export const event: EventName = "guildMemberAdd";

export const execute: EventExecute<"guildMemberAdd"> = async(member) => {

};