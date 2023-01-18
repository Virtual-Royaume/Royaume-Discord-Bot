import type { CodegenConfig } from "@graphql-codegen/cli";
import { getStringEnv } from "./src/utils/EnvVariable";

const apiLink = getStringEnv("API_LINK");
const apiToken = getStringEnv("API_TOKEN");

const config: CodegenConfig = {
  schema: [
    { [apiLink]: { headers: { authorization: apiToken } } }
  ],
  documents: "./src/**/*.ts",
  generates: {
    "./src/utils/request/graphql": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;