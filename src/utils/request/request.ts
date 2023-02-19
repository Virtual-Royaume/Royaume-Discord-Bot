import { Response } from "./request.type";
import { getStringEnv } from "$core/utils/EnvVariable";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import Logger from "../Logger";
import { URLSearchParams } from "url";

type Method = "get" | "delete" | "post"| "put";

interface RequestParams extends Omit<RequestInit, "method"> {
  query?: Record<string, string | string[]>
}

export const restJsonRequest = async<T extends object>(method: Method, endpoint: string, config: RequestParams = {}): Promise<Response<T>> => {
  if (config.query) {
    const urlParams = new URLSearchParams(config.query);
    endpoint = `${endpoint}?${urlParams.toString()}`;
  }

  config.headers = { ...config.headers, "Content-Type": "application/json" };
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

export const restTextRequest = async(method: Method, endpoint: string, config: RequestParams = {}): Promise<Response<string>> => {
  if (config.query) {
    const urlParams = new URLSearchParams(config.query);
    endpoint = `${endpoint}?${urlParams.toString()}`;
  }

  config.headers = { ...config.headers, "Content-Type": "text/plain" };
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
    data: await response.text()
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