import { gql } from "graphql-request";
import { ServerActivity } from "$core/api/Schema";

export type GetCurrentServerActivityType = { todayServerActivity: ServerActivity };
export const getCurrentServerActivity = gql`
    query {
        todayServerActivity {
            date
            voiceMinute
            messageCount
            memberCount
        }
    }
`;

export type GetServerActivityHistoryType = { serverActivity: ServerActivity[] };
export type GetServerActivityHistoryVariables = {
    historyCount: number;
};
export const getServerActivityHistory = gql`
    query($historyCount: Int!){
        serverActivity(historyCount: $historyCount){
            date
            voiceMinute
            messageCount
            memberCount
        }
    }
`;

export type SetServerCountType = { setServerActivityMemberCount: boolean };
export type SetServerCountVariables = {
    count: number;
};
export const setMemberCount = gql`
    mutation($count: Int!) {
        setServerActivityMemberCount(count: $count)
    }
`;