import { z } from "zod";

export const envDTO = z.object({
  API_LINK: z.string().url(),
  API_TOKEN: z.string().uuid(),
  BOT_TOKEN: z.string().nonempty(),
  GH_TOKEN: z.string().nonempty()
});