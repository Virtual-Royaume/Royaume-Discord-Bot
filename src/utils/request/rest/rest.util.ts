import type { Method, RequestParams } from "./rest.type";
import type { Result } from "rustic-error";
import { ok, error } from "rustic-error";
import { URLSearchParams } from "url";
import { logger } from "#/utils/logger";

export const restRequest = async(method: Method, endpoint: string, config: RequestParams = {}): Promise<Result<Response, Error>> => {
  if (config.query) {
    const urlParams = new URLSearchParams(config.query);
    endpoint = `${endpoint}?${urlParams.toString()}`;
  }

  const response = await fetch(endpoint, { ...config, method: method });

  if (!response.ok) {
    logger.error("Rest request failed :");
    console.log(method, endpoint, config);

    return error(Error(`Rest request failed: ${method} ${endpoint}`));
  }

  return ok(response);
};

export const restJsonRequest = async<T extends object>(method: Method, endpoint: string, config: RequestParams = {}): Promise<Result<T, Error>> => {
  config.headers = { ...config.headers, "Content-Type": "application/json" };
  const result = await restRequest(method, endpoint, config);

  if (!result.ok) return result;

  return ok(await result.value.json());
};

export const restTextRequest = async(method: Method, endpoint: string, config: RequestParams = {}): Promise<Result<string, Error>> => {
  config.headers = { ...config.headers, "Content-Type": "text/plain" };
  const result = await restRequest(method, endpoint, config);

  if (!result.ok) return result;

  return ok(await result.value.text());
};