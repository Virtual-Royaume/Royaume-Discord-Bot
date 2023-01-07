import Client from "$core/Client";
import Logger from "$core/utils/Logger";
import Event, { EventName } from "$core/events/Event";

export default class Ready extends Event {

  public readonly enabledInDev = true;

  public name: EventName = "ready";

  public once = true;

  public async execute() : Promise<void> {
    // Load tasks :
    await Client.instance.taskManager.load();

    // Register slash commands :
    await Client.instance.commandManager.register();

    // Finish :
    Logger.success("Client has been started");
  }

}