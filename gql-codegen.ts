import type { CodegenConfig } from "@graphql-codegen/cli";
import { getStringEnv } from "./src/utils/env-variable";

const apiLink = getStringEnv("API_LINK");
const apiToken = getStringEnv("API_TOKEN");

const config: CodegenConfig = {
  schema: [
    { [apiLink]: { headers: { authorization: apiToken } } }
  ],
  documents: "./src/**/*.ts",
  generates: {
    "./src/utils/request/graphql/code-gen/": {
      preset: "client",
      plugins: [],
      config: {
        scalars: {
          Date: "string"
        }
      }
    }
  }
};

export default config;