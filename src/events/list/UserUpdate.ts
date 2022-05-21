import { User } from "discord.js";
import { request } from "../../api/Request";
import { setUsernameAndProfilPicture } from "../../api/requests/Member";
import Event from "../Event";

export default class UserUpdate extends Event {

    public name: string = "userUpdate";

    public async execute(_: User, newUser: User) : Promise<void> {
        request(setUsernameAndProfilPicture, { 
            id: newUser.id, 
            username: newUser.username,
            profilPicture: newUser.displayAvatarURL({ dynamic: true })
        });
    }
}