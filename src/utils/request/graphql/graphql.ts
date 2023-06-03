import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import { logger } from "#/utils/logger";
import type { Result } from "rustic-error";
import { error, ok } from "rustic-error";
import { env } from "#/configs/env";

export const gqlRequest = async<D, V>(document: TypedDocumentNode<D, V>, variables?: V): Promise<Result<D, Error>> => {
  const response = await fetch(env.API_LINK, {
    method: "post",
    headers: {
      "authorization": env.API_TOKEN,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: print(document),
      variables
    })
  });

  if (!response.ok) {
    logger.error("GraphQL request failed :");
    console.log(JSON.stringify(document, null, 2));

    return error(Error("GraphQL request failed"));
  }

  return ok((await response.json() as { data: D }).data);
};