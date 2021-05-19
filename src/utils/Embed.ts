const discord = require("discord.js");
const constants = require("./Constants");

class Embed {

    /**
     * 
     * @param {string} message 
     * @param {discord.TextChannel} channel 
     */
    static send(message, channel){
        let embed = new discord.MessageEmbed();

        embed.setColor(constants.COLOR);
        embed.setDescription(message);        

        channel.send(embed);
    }
}

module.exports = Embed;