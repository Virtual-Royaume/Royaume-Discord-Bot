import "dotenv/config";
import { envDTO } from "./env.dto";

const parser = envDTO.safeParse(process.env);

if (!parser.success) throw Error("tgm");

export const env = parser.data;