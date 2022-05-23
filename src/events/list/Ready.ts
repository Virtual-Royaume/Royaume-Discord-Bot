import Client from "../../Client";
import Logger from "../../utils/Logger";
import Event from "../Event";

export default class Ready extends Event {

    public name: string = "ready";
    public once: boolean = true;

    public async execute() : Promise<void> {
      // Register slash commands :
      Client.instance.commandManager.register();

      // Finish :
      Logger.success("Client has been started");
    }
}