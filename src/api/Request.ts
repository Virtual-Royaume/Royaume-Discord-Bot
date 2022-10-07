import { getEnv } from "$core/utils/EnvVariable";
import { request as simpleRequest } from "$core/utils/Request";

type VariableType = Record<string, string | number | boolean>;

export async function request<ReturnType, Variables extends VariableType | undefined>(request: string, variables?: Variables) : Promise<ReturnType> {
    if (variables) for (const [key, value] of Object.entries(variables)) request = request.replace(key, value.toString());

    return (await simpleRequest<ReturnType>(
        getEnv<string>("API_LINK"),
        {
            headers: {
                authorization: getEnv<string>("API_TOKEN")
            },
            data: request
        }
    )).body;
}