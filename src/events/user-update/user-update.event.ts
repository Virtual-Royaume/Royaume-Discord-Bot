import type { EventExecute, EventName } from "#/utils/handler/event";
import { gqlRequest } from "#/utils/request";
import { setUsernameAndProfilePicture } from "#/api/requests/member";
import { logger } from "#/utils/logger";
import { userWithId } from "#/utils/discord/user";

export const event: EventName = "userUpdate";

export const execute: EventExecute<"userUpdate"> = (_, newUser) => {
  void gqlRequest(setUsernameAndProfilePicture, {
    id: newUser.id,
    username: newUser.username,
    profilePicture: newUser.displayAvatarURL()
  });

  logger.info(`User ${userWithId(newUser)} updated`);
};