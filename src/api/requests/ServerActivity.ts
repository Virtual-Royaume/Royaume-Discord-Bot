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
  	query GetServerActivityHistory($historyCount: Int!){
		serverActivity(historyCount: $historyCount){
			date
			voiceMinute
			messageCount
			memberCount
		}
	}
`;

export const setMemberCount = gql`
	mutation SetMemberCount($count: Int!) {
        setServerActivityMemberCount(count: $count)
    }
`;