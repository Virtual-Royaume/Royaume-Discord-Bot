import axios, { AxiosRequestConfig } from "axios";

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