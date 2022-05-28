import { User } from "discord.js";
import { request } from "../../api/Request";
import { setUsernameAndprofilePicture } from "../../api/requests/Member";
import Event from "../Event";

export default class UserUpdate extends Event {

    public name: string = "userUpdate";

    public async execute(_: User, newUser: User) : Promise<void> {
        request(setUsernameAndprofilePicture, { 
            id: newUser.id, 
            username: newUser.username,
            profilePicture: newUser.displayAvatarURL({ dynamic: true })
        });
    }
}