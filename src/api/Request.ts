import gqlRequest, { Variables } from "graphql-request";
import { api } from "../../resources/config/secret.json"

export async function request<T>(document: string, variables?: Variables) : Promise<T> {
    return await gqlRequest<T>(api.endpoint, document, variables, {
        "authorization": api.token
    });
}