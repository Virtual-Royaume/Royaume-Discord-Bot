import { Response } from "./request.type";
import { getStringEnv } from "$core/utils/env-variable";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import { logger } from "../logger";
import { URLSearchParams } from "url";

type Method = "get" | "delete" | "post"| "put";

interface RequestParams extends Omit<RequestInit, "method"> {
  query?: Record<string, string | string[]>;
}

export const restRequest = async(method: Method, endpoint: string, config: RequestParams = {}): Promise<Response<globalThis.Response>> => {
  if (config.query) {
    const urlParams = new URLSearchParams(config.query);
    endpoint = `${endpoint}?${urlParams.toString()}`;
  }

  const response = await fetch(endpoint, { ...config, method: method });

  if (!response.ok) {
    logger.error("Rest request failed :");
    console.log(method, endpoint, config);

    return {
      success: false
    };
  }

  return {
    success: true,
    data: response
  };
};

export const restJsonRequest = async<T extends object>(method: Method, endpoint: string, config: RequestParams = {}): Promise<Response<T>> => {
  config.headers = { ...config.headers, "Content-Type": "application/json" };
  const response = await restRequest(method, endpoint, config);

  if (!response.success) return response;

  return {
    success: response.success,
    data: await response.data.json()
  };
};

export const restTextRequest = async(method: Method, endpoint: string, config: RequestParams = {}): Promise<Response<string>> => {
  config.headers = { ...config.headers, "Content-Type": "text/plain" };
  const response = await restRequest(method, endpoint, config);

  if (!response.success) return response;

  return {
    success: response.success,
    data: await response.data.text()
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
    logger.error("GraphQL request failed :");
    console.log(JSON.stringify(document, null, 2));
    console.log(await response.text());

    return {
      success: false
    };
  }

  return {
    success: true,
    data: (await response.json()).data
  };
};