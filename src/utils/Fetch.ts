import fetch, { RequestInit } from "node-fetch";

export interface Response<T> {
    status: number;
    body: T;
}

export const githubRaw = "https://raw.githubusercontent.com/";

export async function jsonFetch<T>(link: string, request: RequestInit = {}): Promise<Response<T>> {
    const response = await fetch(link, request);

    return {
        status: response.status,
        body: await response.json()
    };
}

export async function textFetch(link: string, request: RequestInit = {}) : Promise<Response<string>> {
    const response = await fetch(link, request);

    return {
        status: response.status,
        body: await response.text()
    };
}