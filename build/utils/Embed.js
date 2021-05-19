"use strict";
var discord = require("discord.js");
var constants = require("./Constants");
var Embed = /** @class */ (function () {
    function Embed() {
    }
    /**
     *
     * @param {string} message
     * @param {discord.TextChannel} channel
     */
    Embed.send = function (message, channel) {
        var embed = new discord.MessageEmbed();
        embed.setColor(constants.COLOR);
        embed.setDescription(message);
        channel.send(embed);
    };
    return Embed;
}());
module.exports = Embed;
