import { Response } from "./request.type";
import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { getStringEnv } from "$core/utils/EnvVariable";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import Logger from "../Logger";

export const restRequest = async<T>(method: Lowercase<Method>, endpoint: string, config: AxiosRequestConfig = {}): Promise<Response<T>> => {
    try {
        config.method = method;
        config.url = endpoint;

        const response = await axios(config);

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        Logger.error("Rest request failed :");
        console.log(config);

        return { success: false };
    }
};

export const gqlRequest = async<D, V>(document: TypedDocumentNode<D, V>, variables?: V): Promise<Response<D>> => {
    try {
        const response = await axios(getStringEnv("API_LINK"), {
            method: "post",
            headers: {
                "authorization": getStringEnv("API_TOKEN"),
                "content-type": "application/json"
            },
            data: {
                query: print(document),
                variables
            }
        });

        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        Logger.error("GraphQL request failed :");
        console.log(error instanceof AxiosError ? error.response?.data.errors ?? error : error);

        return { success: false };
    }
};