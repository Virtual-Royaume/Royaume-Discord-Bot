import axios, { AxiosRequestConfig } from "axios";
import { getEnv } from "./EnvVariable";

export type ResponseSuccess<T> = {
    success: true;
    data: T;
}

export type ResponseError<T> = {
    success: false;
    data: null;
}

export type Response<T> = ResponseSuccess<T> | ResponseError<T>;

export async function request<T>(endpoint: string, config?: AxiosRequestConfig): Promise<Response<T>> {
    try {
        const response = await axios(endpoint, config);

        return {
            success: response.status === 200,
            data: response.status === 200 ? response.data : null
        }
    } catch {
        return {
            success: false,
            data: null
        }
    }
}

type GqlVariableType = Record<string, string | number | boolean>;

export async function gqlRequest<ReturnType, Variables extends GqlVariableType | undefined>(
    query: string, variables?: Variables
): Promise<Response<ReturnType>> {
    const response = await request<{ data: ReturnType }>(
        process.env.API_LINK as string,
        {
            method: "POST",
            headers: {
                "Authorization": process.env.API_TOKEN as string,
                "content-type": "application/json"
            },
            data: { query, variables }
        }
    );

    console.log(response.success, response.data);
    return response.data ? { success: response.success, data: response.data?.data } : { success: response.success, data: response.data };
}