import { EventExecute, EventName } from "$core/utils/handler/event";
import { gqlRequest } from "$core/utils/request";
import { EnableInDev } from "$core/utils/handler";
import { setUsernameAndProfilePicture } from "$core/api/requests/member";

export const enableInDev: EnableInDev = true;

export const event: EventName = "userUpdate";

export const execute: EventExecute<"userUpdate"> = async(_, newUser) => {
  gqlRequest(setUsernameAndProfilePicture, {
    id: newUser.id,
    username: newUser.username,
    profilePicture: newUser.displayAvatarURL()
  });
};