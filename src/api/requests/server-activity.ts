import { graphql } from "$core/utils/request";

export const getCurrentServerActivity = graphql(`
    query getCurrentServerActivity {
        todayServerActivity {
            date
            voiceMinute
            messageCount
            memberCount
        }
    }
`);

export const getServerActivityHistory = graphql(`
    query getServerActivityHistory($historyCount: Int!){
        serverActivity(historyCount: $historyCount){
            date
            voiceMinute
            messageCount
            memberCount
        }
    }
`);

export const setMemberCount = graphql(`
    mutation setMemberCount($count: Int!) {
        setServerActivityMemberCount(count: $count)
    }
`);