/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n    mutation addChannel($channelId: ID!, $category: String!){\n        addChannel(channelId: $channelId, category: $category)\n    }\n": types.AddChannelDocument,
    "\n    mutation removeChannel($channelId: ID!){\n        removeChannel(channelId: $channelId)\n    }\n": types.RemoveChannelDocument,
    "\n    query getChannels {\n        channels {\n            channelId\n            category\n        }\n    }\n": types.GetChannelsDocument,
    "\n    mutation addRole($roleId: ID!, $category: String!){\n        addRole(roleId: $roleId, category: $category)\n    }\n": types.AddRoleDocument,
    "\n    mutation removeRole($roleId: ID!){\n        removeRole(roleId: $roleId)\n    }\n": types.RemoveRoleDocument,
    "\n    query getRoles {\n        roles {\n            roleId\n            category\n        }\n    }\n": types.GetRolesDocument,
    "\n    mutation createMember($id: ID!, $username: String!, $profilePicture: String!){\n        createMember(id: $id, username: $username, profilePicture: $profilePicture){\n            _id\n        }\n    }\n": types.CreateMemberDocument,
    "\n    mutation setAlwaysOnServer($id: ID!, $value: Boolean!){\n        updateMember(id: $id, input: {\n            isOnServer: $value\n        })\n    }\n": types.SetAlwaysOnServerDocument,
    "\n    mutation setUsernameAndProfilePicture($id: ID!, $username: String!, $profilePicture: String!){\n        updateMember(id: $id, input: {\n            username: $username\n            profilePicture: $profilePicture\n        })\n    }\n": types.SetUsernameAndProfilePictureDocument,
    "\n    mutation setBirthday($id: ID!, $date: Date!){\n        updateMember(id: $id, input: {\n            birthday: $date\n        })\n    }\n": types.SetBirthdayDocument,
    "\n    mutation incChannelMessage($id: ID!, $channelId: ID!){\n        incMemberDiscordActivityChannel(id: $id, channelId: $channelId)\n    }\n": types.IncChannelMessageDocument,
    "\n    mutation incVoiceMinute($id: ID!){\n        incMemberDiscordVoiceMinute(id: $id)\n    }\n": types.IncVoiceMinuteDocument,
    "\n    query getMember($id: ID!){\n        member(id: $id) {\n          _id\n          username\n          profilePicture\n          birthday\n          isOnServer\n          activity {\n            tier\n            voiceMinute\n            monthVoiceMinute\n            messages {\n              totalCount\n              monthCount\n              perChannel {\n                channelId\n                messageCount\n              }\n            }\n            points {\n              count\n              progress\n            }\n          }\n        }\n      }\n": types.GetMemberDocument,
    "\n    query getMemberTier {\n        members {\n            _id\n            activity {\n                tier\n            }\n        }\n    }\n": types.GetMemberTierDocument,
    "\n    query getMemberOnServerStatus {\n        members {\n            _id\n            username\n            isOnServer\n        }\n    }\n": types.GetMemberOnServerStatusDocument,
    "\n    query getBirthdays {\n        members {\n            _id\n            username\n            birthday\n            profilePicture\n        }\n    }\n": types.GetBirthdaysDocument,
    "\n    query getVoiceTime {\n        members {\n            _id\n            username\n            activity {\n                voiceMinute\n            }\n        }\n    }\n": types.GetVoiceTimeDocument,
    "\n    query getMonthMessageCount {\n        members {\n            _id\n            username\n            activity {\n                messages {\n                    monthCount\n                }\n            }\n        }\n    }\n": types.GetMonthMessageCountDocument,
    "\n    query getMonthVoiceMinute {\n        members {\n            _id\n            username\n            activity {\n                monthVoiceMinute\n            }\n        }\n    }\n": types.GetMonthVoiceMinuteDocument,
    "\n    query getMonthActivity {\n        members {\n            _id\n            username\n            activity {\n                monthVoiceMinute\n                messages {\n                    monthCount\n                }\n            }\n        }\n    }\n": types.GetMonthActivityDocument,
    "\n    query getTotalMessageCount {\n        members {\n            _id\n            username\n            activity {\n                messages {\n                    totalCount\n                }\n            }\n        }\n    }\n": types.GetTotalMessageCountDocument,
    "\n    query getChannelMessageCount {\n        members {\n            _id\n            username\n            activity {\n                messages {\n                    perChannel {\n                        channelId\n                        messageCount\n                    }\n                }\n            }\n        }\n    }\n": types.GetChannelMessageCountDocument,
    "\n    query getMemberActivityTier($memberId: ID!) {\n        member(id: $memberId) {\n            activity {\n                tier\n            }\n        }\n    }\n": types.GetMemberActivityTierDocument,
    "\n    query getPresenceMessages {\n        presenceMessages {\n            _id\n            type\n            text\n        }\n    }\n": types.GetPresenceMessagesDocument,
    "\n    mutation addPresenceMessage($type: PresenceType!, $text: String!) {\n        addPresenceMessage(type: $type, text: $text)\n    }\n": types.AddPresenceMessageDocument,
    "\n    mutation remoePresenceMessage($id: ID!){\n        removePresenceMessage(id: $id)\n    }\n": types.RemoePresenceMessageDocument,
    "\n    query getCurrentServerActivity {\n        todayServerActivity {\n            date\n            voiceMinute\n            messageCount\n            memberCount\n        }\n    }\n": types.GetCurrentServerActivityDocument,
    "\n    query getServerActivityHistory($historyCount: Int!){\n        serverActivity(historyCount: $historyCount){\n            date\n            voiceMinute\n            messageCount\n            memberCount\n        }\n    }\n": types.GetServerActivityHistoryDocument,
    "\n    mutation setMemberCount($count: Int!) {\n        setServerActivityMemberCount(count: $count)\n    }\n": types.SetMemberCountDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation addChannel($channelId: ID!, $category: String!){\n        addChannel(channelId: $channelId, category: $category)\n    }\n"): (typeof documents)["\n    mutation addChannel($channelId: ID!, $category: String!){\n        addChannel(channelId: $channelId, category: $category)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation removeChannel($channelId: ID!){\n        removeChannel(channelId: $channelId)\n    }\n"): (typeof documents)["\n    mutation removeChannel($channelId: ID!){\n        removeChannel(channelId: $channelId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getChannels {\n        channels {\n            channelId\n            category\n        }\n    }\n"): (typeof documents)["\n    query getChannels {\n        channels {\n            channelId\n            category\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation addRole($roleId: ID!, $category: String!){\n        addRole(roleId: $roleId, category: $category)\n    }\n"): (typeof documents)["\n    mutation addRole($roleId: ID!, $category: String!){\n        addRole(roleId: $roleId, category: $category)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation removeRole($roleId: ID!){\n        removeRole(roleId: $roleId)\n    }\n"): (typeof documents)["\n    mutation removeRole($roleId: ID!){\n        removeRole(roleId: $roleId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getRoles {\n        roles {\n            roleId\n            category\n        }\n    }\n"): (typeof documents)["\n    query getRoles {\n        roles {\n            roleId\n            category\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createMember($id: ID!, $username: String!, $profilePicture: String!){\n        createMember(id: $id, username: $username, profilePicture: $profilePicture){\n            _id\n        }\n    }\n"): (typeof documents)["\n    mutation createMember($id: ID!, $username: String!, $profilePicture: String!){\n        createMember(id: $id, username: $username, profilePicture: $profilePicture){\n            _id\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation setAlwaysOnServer($id: ID!, $value: Boolean!){\n        updateMember(id: $id, input: {\n            isOnServer: $value\n        })\n    }\n"): (typeof documents)["\n    mutation setAlwaysOnServer($id: ID!, $value: Boolean!){\n        updateMember(id: $id, input: {\n            isOnServer: $value\n        })\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation setUsernameAndProfilePicture($id: ID!, $username: String!, $profilePicture: String!){\n        updateMember(id: $id, input: {\n            username: $username\n            profilePicture: $profilePicture\n        })\n    }\n"): (typeof documents)["\n    mutation setUsernameAndProfilePicture($id: ID!, $username: String!, $profilePicture: String!){\n        updateMember(id: $id, input: {\n            username: $username\n            profilePicture: $profilePicture\n        })\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation setBirthday($id: ID!, $date: Date!){\n        updateMember(id: $id, input: {\n            birthday: $date\n        })\n    }\n"): (typeof documents)["\n    mutation setBirthday($id: ID!, $date: Date!){\n        updateMember(id: $id, input: {\n            birthday: $date\n        })\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation incChannelMessage($id: ID!, $channelId: ID!){\n        incMemberDiscordActivityChannel(id: $id, channelId: $channelId)\n    }\n"): (typeof documents)["\n    mutation incChannelMessage($id: ID!, $channelId: ID!){\n        incMemberDiscordActivityChannel(id: $id, channelId: $channelId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation incVoiceMinute($id: ID!){\n        incMemberDiscordVoiceMinute(id: $id)\n    }\n"): (typeof documents)["\n    mutation incVoiceMinute($id: ID!){\n        incMemberDiscordVoiceMinute(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getMember($id: ID!){\n        member(id: $id) {\n          _id\n          username\n          profilePicture\n          birthday\n          isOnServer\n          activity {\n            tier\n            voiceMinute\n            monthVoiceMinute\n            messages {\n              totalCount\n              monthCount\n              perChannel {\n                channelId\n                messageCount\n              }\n            }\n            points {\n              count\n              progress\n            }\n          }\n        }\n      }\n"): (typeof documents)["\n    query getMember($id: ID!){\n        member(id: $id) {\n          _id\n          username\n          profilePicture\n          birthday\n          isOnServer\n          activity {\n            tier\n            voiceMinute\n            monthVoiceMinute\n            messages {\n              totalCount\n              monthCount\n              perChannel {\n                channelId\n                messageCount\n              }\n            }\n            points {\n              count\n              progress\n            }\n          }\n        }\n      }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getMemberTier {\n        members {\n            _id\n            activity {\n                tier\n            }\n        }\n    }\n"): (typeof documents)["\n    query getMemberTier {\n        members {\n            _id\n            activity {\n                tier\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getMemberOnServerStatus {\n        members {\n            _id\n            username\n            isOnServer\n        }\n    }\n"): (typeof documents)["\n    query getMemberOnServerStatus {\n        members {\n            _id\n            username\n            isOnServer\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getBirthdays {\n        members {\n            _id\n            username\n            birthday\n            profilePicture\n        }\n    }\n"): (typeof documents)["\n    query getBirthdays {\n        members {\n            _id\n            username\n            birthday\n            profilePicture\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getVoiceTime {\n        members {\n            _id\n            username\n            activity {\n                voiceMinute\n            }\n        }\n    }\n"): (typeof documents)["\n    query getVoiceTime {\n        members {\n            _id\n            username\n            activity {\n                voiceMinute\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getMonthMessageCount {\n        members {\n            _id\n            username\n            activity {\n                messages {\n                    monthCount\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query getMonthMessageCount {\n        members {\n            _id\n            username\n            activity {\n                messages {\n                    monthCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getMonthVoiceMinute {\n        members {\n            _id\n            username\n            activity {\n                monthVoiceMinute\n            }\n        }\n    }\n"): (typeof documents)["\n    query getMonthVoiceMinute {\n        members {\n            _id\n            username\n            activity {\n                monthVoiceMinute\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getMonthActivity {\n        members {\n            _id\n            username\n            activity {\n                monthVoiceMinute\n                messages {\n                    monthCount\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query getMonthActivity {\n        members {\n            _id\n            username\n            activity {\n                monthVoiceMinute\n                messages {\n                    monthCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getTotalMessageCount {\n        members {\n            _id\n            username\n            activity {\n                messages {\n                    totalCount\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query getTotalMessageCount {\n        members {\n            _id\n            username\n            activity {\n                messages {\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getChannelMessageCount {\n        members {\n            _id\n            username\n            activity {\n                messages {\n                    perChannel {\n                        channelId\n                        messageCount\n                    }\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query getChannelMessageCount {\n        members {\n            _id\n            username\n            activity {\n                messages {\n                    perChannel {\n                        channelId\n                        messageCount\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getMemberActivityTier($memberId: ID!) {\n        member(id: $memberId) {\n            activity {\n                tier\n            }\n        }\n    }\n"): (typeof documents)["\n    query getMemberActivityTier($memberId: ID!) {\n        member(id: $memberId) {\n            activity {\n                tier\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getPresenceMessages {\n        presenceMessages {\n            _id\n            type\n            text\n        }\n    }\n"): (typeof documents)["\n    query getPresenceMessages {\n        presenceMessages {\n            _id\n            type\n            text\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation addPresenceMessage($type: PresenceType!, $text: String!) {\n        addPresenceMessage(type: $type, text: $text)\n    }\n"): (typeof documents)["\n    mutation addPresenceMessage($type: PresenceType!, $text: String!) {\n        addPresenceMessage(type: $type, text: $text)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation remoePresenceMessage($id: ID!){\n        removePresenceMessage(id: $id)\n    }\n"): (typeof documents)["\n    mutation remoePresenceMessage($id: ID!){\n        removePresenceMessage(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getCurrentServerActivity {\n        todayServerActivity {\n            date\n            voiceMinute\n            messageCount\n            memberCount\n        }\n    }\n"): (typeof documents)["\n    query getCurrentServerActivity {\n        todayServerActivity {\n            date\n            voiceMinute\n            messageCount\n            memberCount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getServerActivityHistory($historyCount: Int!){\n        serverActivity(historyCount: $historyCount){\n            date\n            voiceMinute\n            messageCount\n            memberCount\n        }\n    }\n"): (typeof documents)["\n    query getServerActivityHistory($historyCount: Int!){\n        serverActivity(historyCount: $historyCount){\n            date\n            voiceMinute\n            messageCount\n            memberCount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation setMemberCount($count: Int!) {\n        setServerActivityMemberCount(count: $count)\n    }\n"): (typeof documents)["\n    mutation setMemberCount($count: Int!) {\n        setServerActivityMemberCount(count: $count)\n    }\n"];

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function graphql(source: string): unknown;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;