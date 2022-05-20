import { gql } from "graphql-request";

export const getCurrentServerActivity = gql`
	query TodayServerActivity {
  		todayServerActivity {
			date
			voiceMinute
			messageCount
			memberCount
  		}
	}
`;

export const getServerActivityHistory = gql`
  	query ServerActivity($historyCount: Int!){
		serverActivity(historyCount: $historyCount){
			date
			voiceMinute
			messageCount
			memberCount
		}
	}
`;

export const setMemberCount = gql`
	mutation Mutation($count: Int!) {
        setServerActivityMemberCount(count: $count)
    }
`;