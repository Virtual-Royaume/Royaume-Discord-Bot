import type { CodegenConfig } from "@graphql-codegen/cli";
import { env } from "./src/configs/env";

const config: CodegenConfig = {
  schema: [
    { [env.API_LINK]: { headers: { authorization: env.API_TOKEN } } }
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