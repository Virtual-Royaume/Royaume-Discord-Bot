import Client from "../../Client";
const texts = require("../texts.json");


export default class PresenceUpdate extends Event {

    public name: string = "presenceUpdate";

    public async execute() : Promise<void> {
        setInterval(() => {
            var rdm = Math.floor(Math.random() * texts["messages"].length);
            Client.instance.user?.setActivity(texts["messages"][rdm]["text"], { type: texts["messages"][rdm]["type"] });
        }, 10000);
    }
}