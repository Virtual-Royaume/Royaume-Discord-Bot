import Client from "../../Client";
import Logger from "../../utils/Logger";
import Event, { EventName } from "../Event";

export default class Ready extends Event {

    public name: EventName = "ready";

    public once = true;

    public async execute() : Promise<void> {
        // Register slash commands :
        Client.instance.commandManager.register();

        // Finish :
        Logger.success("Client has been started");
    }
}