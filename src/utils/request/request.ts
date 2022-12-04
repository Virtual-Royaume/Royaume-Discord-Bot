import { Response } from "./request.type";
import { getStringEnv } from "$core/utils/EnvVariable";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import Logger from "../Logger";

type Method = "get" | "delete" | "post"| "put";

export const restRequest = async<T>(method: Method, endpoint: string, config: Omit<RequestInit, "method"> = {}): Promise<Response<T>> => {
  const response = await fetch(endpoint, { ...config, method: method });

  if (!response.ok) {
    Logger.error("Rest request failed :");
    console.log(method, endpoint, config);

    return {
      success: false,
      data: null
    };
  }

  return {
    success: true,
    data: await response.json()
  };
};

export const gqlRequest = async<D, V>(document: TypedDocumentNode<D, V>, variables?: V): Promise<Response<D>> => {
  const response = await fetch(getStringEnv("API_LINK"), {
    method: "post",
    headers: {
      "authorization": getStringEnv("API_TOKEN"),
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: print(document),
      variables
    })
  });

  if (!response.ok) {
    Logger.error("GraphQL request failed :");
    console.log(await response.json());

    return {
      success: false,
      data: null
    };
  }

  return {
    success: true,
    data: (await response.json()).data
  };
};