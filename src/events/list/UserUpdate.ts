import { User } from "discord.js";
import { request } from "$core/api/Request";
import { setUsernameAndprofilePicture } from "$core/api/requests/Member";
import Event, { EventName } from "$core/events/Event";

export default class UserUpdate extends Event {

    public name: EventName = "userUpdate";

    public async execute(_: User, newUser: User) : Promise<void> {
        request(setUsernameAndprofilePicture, {
            id: newUser.id,
            username: newUser.username,
            profilePicture: newUser.displayAvatarURL()
        });
    }
}