// Packages :
const discord = require("discord.js");
const fs = require("fs");
// Create Discord client :
const client = new discord.Client();
client.login(fs.readFileSync(__dirname + "/token.txt", {encoding: "utf-8"}));