import { PermissionString } from "discord.js";
import { TextChannel } from "../constants/ChannelID";

export default interface AdditionalCommandParams {

    usage?: UsageParam[];
    aliases?: string[];
    permissions?: Permissions[];
    allowedChannels?: TextChannel[] | SpecialChannelPerms;
}

// Usage :

type UsageParamType = "optional" | "required";

interface UsageParam {

    type: UsageParamType;
    usage: string;
}

// Permissions :

type Permissions = PermissionString | "TEAM_ADMIN";

// Allowed channels :

type SpecialChannelPerms = "EVERY"; // Allow command to be run in every channel