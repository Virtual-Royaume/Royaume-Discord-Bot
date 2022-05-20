import { gql } from "graphql-request";

const getCurrent = gql`
	query TodayServerActivity {
  		todayServerActivity {
			date
			voiceMinute
			messageCount
			memberCount
  		}
	}
`;

const getHistory = gql`
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