import { GuildMember, TextChannel } from "discord.js";
import Client from "../../client/Client";
import { TextChannel as TC } from "../../constants/ChannelID";
import Event from "../Event";

export default class GuildMemberAdd extends Event {

    constructor(){
        super("guildMemberAdd");
    }

    public async run(member: GuildMember) : Promise<void> {
        if(member.user.bot) return;
        
        const verifChannel: TextChannel = <TextChannel>Client.instance.channels.cache.get(TC.verif);
            
        Client.instance.embed.sendSimple(
            "Bienvenue <@" + member.id + ">, tu es dans le salon de vérification des nouveaux membres !\n\n" +
    
            "**Le Royaume** est un serveur privé amical où la bonne ambiance est donc obligatoire ! " +
            "Ici on parle principalement de programmation, trading (notamment de crypto-monnaie), " + 
            "graphisme, sneakers et d'autres choses encore. Parfois on joue ou on regarde des films " + 
            "ensemble aussi... 🍿\n\n" +
    
            "Si les domaines cités ci-dessus te correspondent et que tu as envie de faire parti de " +
            "cette communauté privée et d'évoluer avec nous, il faudra que tu fasses une petite présentation " +
            "de toi, tes ambitions, tes projets, tes centres d'intêret... Donne nous envie quoi !\n\n" +
    
            "Nous reviendrons vers toi si tu as l'air cool !",
    
            verifChannel
        );
        
        verifChannel.send("<@" + member.id + ">").then(mentionMsg => mentionMsg.delete());

        const role = Client.instance.getGuild().roles.cache.filter(role => role.name === "verif").first(); 

        if(role) member.roles.add(role);

        // let memberDB = await Member.getMember(member.user);

        // if(memberDB.alwaysInTheServer === false){
        //     memberDB.alwaysInTheServer = true;
        //     memberDB.save();
        // }
    }
}