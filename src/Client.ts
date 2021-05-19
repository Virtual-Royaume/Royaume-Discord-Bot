import * as discord from "discord.js";
import {readFileSync} from "fs";

class Client extends discord.Client {
    public static instance: discord.Client;

    constructor(){
        super();

        Client.instance = new discord.Client();

        Client.instance.login(readFileSync(__dirname + "/token.txt", {encoding: "utf-8"}));
    }

    private loadEvents(){

    }
}

new Client();