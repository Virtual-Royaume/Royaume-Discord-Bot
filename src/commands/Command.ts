import { Message } from "discord.js";
import Client from "../client/Client";
import Constants from "../constants/Constants";
import AdditionalCommandParams from "./AdditionalCommandParams";

export default abstract class Command {

    // Base properties :
    public readonly name: string;
    public readonly description: string;
    public readonly category: string;
    public readonly additionalParams: AdditionalCommandParams;

    // Others :
    private formattedUsage: string = "";

    constructor(name: string, description: string, category: string, additionalParams: AdditionalCommandParams = {}){
        this.name = name;
        this.description = description;
        this.category = category;
        this.additionalParams = additionalParams;
        
        // Formatting of the usage if there is one :
        if(this.additionalParams.usage && this.additionalParams.usage.length > 0){
            this.additionalParams.usage.forEach(usageParam => {
                let symbols = usageParam.type === "optional" ? ["<", ">"] : ["[", "]"];

                this.formattedUsage += " " + symbols[0] + usageParam.usage + symbols[1];
            });
        }
    }

    public abstract run(args: any[], message: Message) : void;

    public getFormattedUsage() : string {
        if(this.additionalParams.usage){
            return "Utilisation : ``" + Constants.commandPrefix + this.name + this.formattedUsage + "``";
        } else {
            Client.instance.logger.warning("The [command: " + this.name + ", class: " + this.constructor.name + "] command uses the getFormattedUsage() method but no usage is specified in the AdditionalCommandParams interface of this command's constructor.");

            return "Erreur, aucun usage n'est disponible pour cette commande.";
        }
    }

}