import gqlRequest, { Variables } from "graphql-request";
import { getEnv } from "$core/utils/EnvVariable";

export async function request<T>(request: string, variables?: Variables) : Promise<T> {
    return await gqlRequest<T>(getEnv<string>("API_LINK") ?? "", request, variables, {
        "authorization": getEnv<string>("API_TOKEN") ?? ""
    });
}