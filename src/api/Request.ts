import gqlRequest, { Variables } from "graphql-request";
import { api } from "../../resources/config/secret.json"

export async function request<T>(request: string, variables?: Variables) : Promise<T> {
    return await gqlRequest<T>(api.endpoint, request, variables, {
        "authorization": api.token
    });
}