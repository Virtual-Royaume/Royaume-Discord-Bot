import axios, { AxiosRequestConfig } from "axios";

type Response<T> = {
    status: number;
    body: T;
}

export const githubRaw = "https://raw.githubusercontent.com/";

// TODO : rewrite this
export async function request<T>(link: string, config: AxiosRequestConfig = {}): Promise<Response<T>> {
    try {
        const response = await axios(link, config);

        return {
            status: response.status,
            body: response.data
        };
    } catch {
        return {
            status: 400,
            body: {} as T
        };
    }
}