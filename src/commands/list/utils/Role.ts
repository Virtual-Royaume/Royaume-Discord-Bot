import { GuildMember, Message, TextChannel, Role as DRole } from "discord.js";
import Client from "../../../client/Client";
import Command from "../../Command";

export default class Role extends Command {

    constructor(){
        super(
            "role",
            "Permet de choisir ses rôles",
            "utils",
            {
                usage: [
                    {type: "required", usage: "le rôle que vous souhaitez obtenir ou retirer"}
                ],
                aliases: ["r"]
            }
        );
    }

    public async run(args: string[], message: Message) : Promise<void> {
        // We use require for this for import with variable (dynamic path name)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const rolesWithCategory: Record<string, string[]> = require(Client.instance.resources + "/configs/role-category.json");

        let roles: string[] = [];
        roles = roles.concat(...Object.values(rolesWithCategory));

        if(roles.indexOf(args[0]) == -1){
            Client.instance.embed.sendSimple(
                this.getFormattedUsage(), 
                <TextChannel>message.channel
            );

            let rolesList = "**__Liste des rôles disponibles__**\n\n";

            for(const [category, roles] of Object.entries(rolesWithCategory)){
                rolesList += "**" + category + " :** " + roles.join(", ") + "\n\n";
            }

            Client.instance.embed.sendSimple(rolesList, <TextChannel>message.channel);
            return;
        }

        const member: GuildMember|null = message.member;
        const role: string = args[0];
        const roleInstance: DRole|undefined = message.guild?.roles.cache.filter(r => r.name === role).first();

        if(member && roleInstance){
            if(member.roles.cache.filter(r => r.name === role).size > 0){
                member.roles.remove(roleInstance);
    
                Client.instance.embed.sendSimple(
                    "Votre rôle **" + role + "** a bien été supprimé.",
                    <TextChannel>message.channel
                );
            } else {
                member.roles.add(roleInstance);
    
                Client.instance.embed.sendSimple(
                    "Vous avez desormais le rôle **" + role + "** !",
                    <TextChannel>message.channel
                );
            }
        }
    }
}