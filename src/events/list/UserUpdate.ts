import { User } from "discord.js";
import { setUsernameAndProfilePicture } from "$core/api/requests/Member";
import Event, { EventName } from "$core/events/Event";
import { gqlRequest } from "$core/utils/request";
import { isDevEnvironment } from "$core/utils/Environment";

export default class UserUpdate extends Event {

  public name: EventName = "userUpdate";

  public async execute(_: User, newUser: User): Promise<void> {
    if (isDevEnvironment) return;

    gqlRequest(setUsernameAndProfilePicture, {
      id: newUser.id,
      username: newUser.username,
      profilePicture: newUser.displayAvatarURL()
    });
  }

}