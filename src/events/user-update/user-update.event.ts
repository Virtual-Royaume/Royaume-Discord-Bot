import type { EventExecute, EventName } from "$core/utils/handler/event";
import { gqlRequest } from "$core/utils/request";
import { setUsernameAndProfilePicture } from "$core/api/requests/member";
import { logger } from "$core/utils/logger";
import { userWithId } from "$core/utils/discord/user";

export const event: EventName = "userUpdate";

export const execute: EventExecute<"userUpdate"> = (_, newUser) => {
  void gqlRequest(setUsernameAndProfilePicture, {
    id: newUser.id,
    username: newUser.username,
    profilePicture: newUser.displayAvatarURL()
  });

  logger.info(`User ${userWithId(newUser)} updated`);
};