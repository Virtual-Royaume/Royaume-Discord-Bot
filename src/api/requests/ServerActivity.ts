import { ServerActivity } from "$core/api/Schema";

export type GetCurrentServerActivityType = { todayServerActivity: ServerActivity };
export const getCurrentServerActivity = `
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
export const getServerActivityHistory = `
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
export const setMemberCount = `
    mutation($count: Int!) {
        setServerActivityMemberCount(count: $count)
    }
`;