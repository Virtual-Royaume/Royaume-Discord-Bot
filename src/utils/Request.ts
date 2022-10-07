import axios, { AxiosRequestConfig } from "axios";

export interface Response<T> {
    status: number;
    body: T;
}

export const githubRaw = "https://raw.githubusercontent.com/";

export async function request<T>(link: string, config: AxiosRequestConfig = {}): Promise<Response<T>> {
    const response = await axios(link, config);

    return {
        status: response.status,
        body: response.data
    };
}