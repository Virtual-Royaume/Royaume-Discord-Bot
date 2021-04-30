const constants = require("../utils/Constants");
const embed = require("../utils/Embed");

bot.on("guildMemberAdd", (member) => {
    /*embed.send(
        "Bienvenue <@" + member.id + "> !\n\n" +

        "**Le Royaume** est un serveur privé amical où la bonne ambiance est donc obligatoire ! " +
        "Ici on parle principalement de programmation, trading (notamment de crypto-monnaie), " + 
        "graphisme, sneakers et d'autres choses encore. Parfois on joue ou on regarde des films " + 
        "ensemble aussi... 🍿\n\n" +
        
        "Les rôles que vous voyez sur votre droite sont définis selon votre activité ainsi que " + 
        "l'importance que vous portez au Royaume !\n\n" +

        "Pour pouvoir accéder aux différents salons de la catégorie travail vous pouvez faire la " + 
        "commande ``-role`` dans <#" + constants.CHANNEL_COMMAND + "> et choisir les rôles qui vous " + 
        "correspondent.\n\n" + 
        
        "Pour finir, on aimerait avoir une petite présentation de vous, parlez nous de vos projets, " + 
        "vos ambitions ainsi de ce que vous savez faire sur internet !",

        bot.channels.cache.get(constants.CHANNEL_GENERAL)
    );*/

    embed.send(
        "Bienvenue <@" + member.id + ">, tu es dans le salon de vérification des nouveaux membres !\n\n" +

        "**Le Royaume** est un serveur privé amical où la bonne ambiance est donc obligatoire ! " +
        "Ici on parle principalement de programmation, trading (notamment de crypto-monnaie), " + 
        "graphisme, sneakers et d'autres choses encore. Parfois on joue ou on regarde des films " + 
        "ensemble aussi... 🍿\n\n" +

        "Si les domaines cités ci-dessus te correspondent et que tu as envie de faire parti de " +
        "cette communauté privée et d'évoluer avec nous, il faudra que tu fasses une petite présentation " +
        "de toi, tes ambitions, tes projets, tes centres d'intêret... Donne nous envie quoi !\n\n" +

        "Nous reviendrons vers toi si tu as l'air cool !",

        bot.channels.cache.get(constants.CHANNEL_VERIF)
    );
    
    bot.channels.cache.get(constants.CHANNEL_VERIF).send("<@" + member.id + ">").then(mentionMsg => mentionMsg.delete());

    member.roles.add(bot.guilds.cache.first().roles.cache.filter(role => role.name === "verif").first());
});