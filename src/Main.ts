//const constants = require("./utils/Constants");
//const embed = require("./utils/Embed");

// Create Discord client :
const client = new discord.Client();

// Starting the bot :
let prefix = "[ROYAUME BOT] ";

console.log(prefix + "Lancement en cours...");

client.on("ready", () => {
    // Load events :
    console.log(prefix + "Chargement des events...");
    
    fs.readdirSync(__dirname + "/events/").forEach(fileName => {
        require("./events/" + fileName);
        
        console.log(prefix + "Event " + fileName + " chargé");
    });

    // Finish :
    console.log(prefix + "Le bot a bien été lancé !");
});
