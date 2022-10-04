import { User } from "discord.js";
import { setUsernameAndprofilePicture } from "$core/api/requests/Member";
import Event, { EventName } from "$core/events/Event";
import { gqlRequest } from "$core/utils/Request";

export default class UserUpdate extends Event {

    public name: EventName = "userUpdate";

    public async execute(_: User, newUser: User): Promise<void> {
        gqlRequest(setUsernameAndprofilePicture, {
            id: newUser.id,
            username: newUser.username,
            profilePicture: newUser.displayAvatarURL()
        });
    }
}