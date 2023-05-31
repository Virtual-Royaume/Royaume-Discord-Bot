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
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query getBirthdaysForList {\n    members {\n      _id\n      username\n      birthday\n      profilePicture\n    }\n  }\n": types.GetBirthdaysForListDocument,
    "\n  query getBirthdaysForNext {\n    members {\n      _id\n      username\n      birthday\n      profilePicture\n    }\n  }\n": types.GetBirthdaysForNextDocument,
    "\n  mutation setBirthday($id: ID!, $date: Date!) {\n    updateMember(id: $id, input: {\n      birthday: $date\n    })\n  }\n": types.SetBirthdayDocument,
    "\n  query getMemberForInactiveCommand($id: ID!){\n    member(id: $id) {\n      _id\n      activity {\n        tier\n        voiceMinute\n        monthVoiceMinute\n        messages {\n          totalCount\n          monthCount\n        }\n      }\n    }\n  }\n": types.GetMemberForInactiveCommandDocument,
    "\n  query getMonthActivityForCommand {\n    members {\n      _id\n      username\n      activity {\n        monthVoiceMinute\n        messages {\n          monthCount\n        }\n      }\n    }\n  }\n": types.GetMonthActivityForCommandDocument,
    "\n  mutation addChannel($channelId: ID!, $category: String!) {\n    addChannel(channelId: $channelId, category: $category)\n  }\n": types.AddChannelDocument,
    "\n  mutation addRole($roleId: ID!, $category: String!) {\n    addRole(roleId: $roleId, category: $category)\n  }\n": types.AddRoleDocument,
    "\n  mutation removeChannelForCommandRemove($channelId: ID!) {\n    removeChannel(channelId: $channelId)\n  }\n": types.RemoveChannelForCommandRemoveDocument,
    "\n  mutation removeRoleForEvent($roleId: ID!){\n    removeRole(roleId: $roleId)\n  }\n": types.RemoveRoleForEventDocument,
    "\n  query getMemberForCommand($id: ID!) {\n    member(id: $id) {\n      _id\n      birthday\n      activity {\n        tier\n        voiceMinute\n        monthVoiceMinute\n        messages {\n          totalCount\n          monthCount\n          perChannel {\n            channelId\n            messageCount\n          }\n        }\n        points {\n          progress\n        }\n      }\n    }\n  }\n": types.GetMemberForCommandDocument,
    "\n  query getServerActivityHistory($historyCount: Int!) {\n    serverActivity(historyCount: $historyCount) {\n      date\n      voiceMinute\n      messageCount\n      memberCount\n    }\n  }\n": types.GetServerActivityHistoryDocument,
    "\n  query getChannelMessageCount {\n    members {\n      _id\n      username\n      activity {\n        messages {\n          perChannel {\n            channelId\n            messageCount\n          }\n        }\n      }\n    }\n  }\n": types.GetChannelMessageCountDocument,
    "\n  query getMonthMessageCount {\n    members {\n      _id\n      username\n      activity {\n        messages {\n          monthCount\n        }\n      }\n    }\n  }\n": types.GetMonthMessageCountDocument,
    "\n  query getTotalMessageCount {\n    members {\n      _id\n      username\n      activity {\n        messages {\n          totalCount\n        }\n      }\n    }\n  }\n": types.GetTotalMessageCountDocument,
    "\n  query getMonthVoiceMinute {\n    members {\n      _id\n      username\n      activity {\n        monthVoiceMinute\n      }\n    }\n  }\n": types.GetMonthVoiceMinuteDocument,
    "\n  query getVoiceTime {\n    members {\n      _id\n      username\n      activity {\n        voiceMinute\n      }\n    }\n  }\n": types.GetVoiceTimeDocument,
    "\n  mutation removeChannel($channelId: ID!) {\n    removeChannel(channelId: $channelId)\n  }\n": types.RemoveChannelDocument,
    "\n  mutation createMemberForEvent($id: ID!, $username: String!, $profilePicture: String!) {\n    createMember(id: $id, username: $username, profilePicture: $profilePicture) {\n      _id\n    }\n  }\n": types.CreateMemberForEventDocument,
    "\n  query getMemberActivityTierEvent($memberId: ID!) {\n    member(id: $memberId) {\n      activity {\n        tier\n      }\n    }\n  }\n": types.GetMemberActivityTierEventDocument,
    "\n  mutation setAlwaysOnServerForEventAdd($id: ID!, $value: Boolean!) {\n    updateMember(id: $id, input: {\n      isOnServer: $value\n    })\n  }\n": types.SetAlwaysOnServerForEventAddDocument,
    "\n  mutation setAlwaysOnServerForEventRemove($id: ID!, $value: Boolean!) {\n    updateMember(id: $id, input: {\n      isOnServer: $value\n    })\n  }\n": types.SetAlwaysOnServerForEventRemoveDocument,
    "\n  mutation incChannelMessage($id: ID!, $channelId: ID!) {\n    incMemberDiscordActivityChannel(id: $id, channelId: $channelId)\n  }\n": types.IncChannelMessageDocument,
    "\n  mutation removeRole($roleId: ID!) {\n    removeRole(roleId: $roleId)\n  }\n": types.RemoveRoleDocument,
    "\n  mutation setUsernameAndProfilePicture($id: ID!, $username: String!, $profilePicture: String!) {\n    updateMember(id: $id, input: {\n      username: $username\n      profilePicture: $profilePicture\n    })\n  }\n": types.SetUsernameAndProfilePictureDocument,
    "\n  mutation incVoiceMinute($id: ID!) {\n    incMemberDiscordVoiceMinute(id: $id)\n  }\n": types.IncVoiceMinuteDocument,
    "\n  mutation setMemberCount($count: Int!) {\n    setServerActivityMemberCount(count: $count)\n  }\n": types.SetMemberCountDocument,
    "\n  query getBirthdaysForTask {\n    members {\n      _id\n      username\n      birthday\n      profilePicture\n    }\n  }\n": types.GetBirthdaysForTaskDocument,
    "\n  query getMemberTierForTaskGame {\n    members {\n      _id\n      activity {\n        tier\n      }\n    }\n  }\n": types.GetMemberTierForTaskGameDocument,
    "\n  query getMemberTierForTask {\n    members {\n      _id\n      activity {\n        tier\n      }\n    }\n  }\n": types.GetMemberTierForTaskDocument,
    "\n  mutation createMemberForTask($id: ID!, $username: String!, $profilePicture: String!) {\n    createMember(id: $id, username: $username, profilePicture: $profilePicture) {\n      _id\n    }\n  }\n": types.CreateMemberForTaskDocument,
    "\n  mutation setAlwaysOnServerForTask($id: ID!, $value: Boolean!) {\n    updateMember(id: $id, input: {\n      isOnServer: $value\n    })\n  }\n": types.SetAlwaysOnServerForTaskDocument,
    "\n  query getMemberForTask($id: ID!) {\n    member(id: $id) {\n      _id\n    }\n  }\n": types.GetMemberForTaskDocument,
    "\n  query getMemberOnServerStatusForTask {\n    members {\n      _id\n      username\n      isOnServer\n    }\n  }\n": types.GetMemberOnServerStatusForTaskDocument,
    "\n  query getChannels {\n    channels {\n      channelId\n      category\n    }\n  }\n": types.GetChannelsDocument,
    "\n  query getRoles {\n    roles {\n      roleId\n      category\n    }\n  }\n": types.GetRolesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getBirthdaysForList {\n    members {\n      _id\n      username\n      birthday\n      profilePicture\n    }\n  }\n"): (typeof documents)["\n  query getBirthdaysForList {\n    members {\n      _id\n      username\n      birthday\n      profilePicture\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getBirthdaysForNext {\n    members {\n      _id\n      username\n      birthday\n      profilePicture\n    }\n  }\n"): (typeof documents)["\n  query getBirthdaysForNext {\n    members {\n      _id\n      username\n      birthday\n      profilePicture\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setBirthday($id: ID!, $date: Date!) {\n    updateMember(id: $id, input: {\n      birthday: $date\n    })\n  }\n"): (typeof documents)["\n  mutation setBirthday($id: ID!, $date: Date!) {\n    updateMember(id: $id, input: {\n      birthday: $date\n    })\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMemberForInactiveCommand($id: ID!){\n    member(id: $id) {\n      _id\n      activity {\n        tier\n        voiceMinute\n        monthVoiceMinute\n        messages {\n          totalCount\n          monthCount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMemberForInactiveCommand($id: ID!){\n    member(id: $id) {\n      _id\n      activity {\n        tier\n        voiceMinute\n        monthVoiceMinute\n        messages {\n          totalCount\n          monthCount\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMonthActivityForCommand {\n    members {\n      _id\n      username\n      activity {\n        monthVoiceMinute\n        messages {\n          monthCount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMonthActivityForCommand {\n    members {\n      _id\n      username\n      activity {\n        monthVoiceMinute\n        messages {\n          monthCount\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addChannel($channelId: ID!, $category: String!) {\n    addChannel(channelId: $channelId, category: $category)\n  }\n"): (typeof documents)["\n  mutation addChannel($channelId: ID!, $category: String!) {\n    addChannel(channelId: $channelId, category: $category)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addRole($roleId: ID!, $category: String!) {\n    addRole(roleId: $roleId, category: $category)\n  }\n"): (typeof documents)["\n  mutation addRole($roleId: ID!, $category: String!) {\n    addRole(roleId: $roleId, category: $category)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeChannelForCommandRemove($channelId: ID!) {\n    removeChannel(channelId: $channelId)\n  }\n"): (typeof documents)["\n  mutation removeChannelForCommandRemove($channelId: ID!) {\n    removeChannel(channelId: $channelId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeRoleForEvent($roleId: ID!){\n    removeRole(roleId: $roleId)\n  }\n"): (typeof documents)["\n  mutation removeRoleForEvent($roleId: ID!){\n    removeRole(roleId: $roleId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMemberForCommand($id: ID!) {\n    member(id: $id) {\n      _id\n      birthday\n      activity {\n        tier\n        voiceMinute\n        monthVoiceMinute\n        messages {\n          totalCount\n          monthCount\n          perChannel {\n            channelId\n            messageCount\n          }\n        }\n        points {\n          progress\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMemberForCommand($id: ID!) {\n    member(id: $id) {\n      _id\n      birthday\n      activity {\n        tier\n        voiceMinute\n        monthVoiceMinute\n        messages {\n          totalCount\n          monthCount\n          perChannel {\n            channelId\n            messageCount\n          }\n        }\n        points {\n          progress\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getServerActivityHistory($historyCount: Int!) {\n    serverActivity(historyCount: $historyCount) {\n      date\n      voiceMinute\n      messageCount\n      memberCount\n    }\n  }\n"): (typeof documents)["\n  query getServerActivityHistory($historyCount: Int!) {\n    serverActivity(historyCount: $historyCount) {\n      date\n      voiceMinute\n      messageCount\n      memberCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getChannelMessageCount {\n    members {\n      _id\n      username\n      activity {\n        messages {\n          perChannel {\n            channelId\n            messageCount\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getChannelMessageCount {\n    members {\n      _id\n      username\n      activity {\n        messages {\n          perChannel {\n            channelId\n            messageCount\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMonthMessageCount {\n    members {\n      _id\n      username\n      activity {\n        messages {\n          monthCount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMonthMessageCount {\n    members {\n      _id\n      username\n      activity {\n        messages {\n          monthCount\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getTotalMessageCount {\n    members {\n      _id\n      username\n      activity {\n        messages {\n          totalCount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getTotalMessageCount {\n    members {\n      _id\n      username\n      activity {\n        messages {\n          totalCount\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMonthVoiceMinute {\n    members {\n      _id\n      username\n      activity {\n        monthVoiceMinute\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMonthVoiceMinute {\n    members {\n      _id\n      username\n      activity {\n        monthVoiceMinute\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getVoiceTime {\n    members {\n      _id\n      username\n      activity {\n        voiceMinute\n      }\n    }\n  }\n"): (typeof documents)["\n  query getVoiceTime {\n    members {\n      _id\n      username\n      activity {\n        voiceMinute\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeChannel($channelId: ID!) {\n    removeChannel(channelId: $channelId)\n  }\n"): (typeof documents)["\n  mutation removeChannel($channelId: ID!) {\n    removeChannel(channelId: $channelId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createMemberForEvent($id: ID!, $username: String!, $profilePicture: String!) {\n    createMember(id: $id, username: $username, profilePicture: $profilePicture) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation createMemberForEvent($id: ID!, $username: String!, $profilePicture: String!) {\n    createMember(id: $id, username: $username, profilePicture: $profilePicture) {\n      _id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMemberActivityTierEvent($memberId: ID!) {\n    member(id: $memberId) {\n      activity {\n        tier\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMemberActivityTierEvent($memberId: ID!) {\n    member(id: $memberId) {\n      activity {\n        tier\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setAlwaysOnServerForEventAdd($id: ID!, $value: Boolean!) {\n    updateMember(id: $id, input: {\n      isOnServer: $value\n    })\n  }\n"): (typeof documents)["\n  mutation setAlwaysOnServerForEventAdd($id: ID!, $value: Boolean!) {\n    updateMember(id: $id, input: {\n      isOnServer: $value\n    })\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setAlwaysOnServerForEventRemove($id: ID!, $value: Boolean!) {\n    updateMember(id: $id, input: {\n      isOnServer: $value\n    })\n  }\n"): (typeof documents)["\n  mutation setAlwaysOnServerForEventRemove($id: ID!, $value: Boolean!) {\n    updateMember(id: $id, input: {\n      isOnServer: $value\n    })\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation incChannelMessage($id: ID!, $channelId: ID!) {\n    incMemberDiscordActivityChannel(id: $id, channelId: $channelId)\n  }\n"): (typeof documents)["\n  mutation incChannelMessage($id: ID!, $channelId: ID!) {\n    incMemberDiscordActivityChannel(id: $id, channelId: $channelId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeRole($roleId: ID!) {\n    removeRole(roleId: $roleId)\n  }\n"): (typeof documents)["\n  mutation removeRole($roleId: ID!) {\n    removeRole(roleId: $roleId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setUsernameAndProfilePicture($id: ID!, $username: String!, $profilePicture: String!) {\n    updateMember(id: $id, input: {\n      username: $username\n      profilePicture: $profilePicture\n    })\n  }\n"): (typeof documents)["\n  mutation setUsernameAndProfilePicture($id: ID!, $username: String!, $profilePicture: String!) {\n    updateMember(id: $id, input: {\n      username: $username\n      profilePicture: $profilePicture\n    })\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation incVoiceMinute($id: ID!) {\n    incMemberDiscordVoiceMinute(id: $id)\n  }\n"): (typeof documents)["\n  mutation incVoiceMinute($id: ID!) {\n    incMemberDiscordVoiceMinute(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setMemberCount($count: Int!) {\n    setServerActivityMemberCount(count: $count)\n  }\n"): (typeof documents)["\n  mutation setMemberCount($count: Int!) {\n    setServerActivityMemberCount(count: $count)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getBirthdaysForTask {\n    members {\n      _id\n      username\n      birthday\n      profilePicture\n    }\n  }\n"): (typeof documents)["\n  query getBirthdaysForTask {\n    members {\n      _id\n      username\n      birthday\n      profilePicture\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMemberTierForTaskGame {\n    members {\n      _id\n      activity {\n        tier\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMemberTierForTaskGame {\n    members {\n      _id\n      activity {\n        tier\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMemberTierForTask {\n    members {\n      _id\n      activity {\n        tier\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMemberTierForTask {\n    members {\n      _id\n      activity {\n        tier\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createMemberForTask($id: ID!, $username: String!, $profilePicture: String!) {\n    createMember(id: $id, username: $username, profilePicture: $profilePicture) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation createMemberForTask($id: ID!, $username: String!, $profilePicture: String!) {\n    createMember(id: $id, username: $username, profilePicture: $profilePicture) {\n      _id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setAlwaysOnServerForTask($id: ID!, $value: Boolean!) {\n    updateMember(id: $id, input: {\n      isOnServer: $value\n    })\n  }\n"): (typeof documents)["\n  mutation setAlwaysOnServerForTask($id: ID!, $value: Boolean!) {\n    updateMember(id: $id, input: {\n      isOnServer: $value\n    })\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMemberForTask($id: ID!) {\n    member(id: $id) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  query getMemberForTask($id: ID!) {\n    member(id: $id) {\n      _id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMemberOnServerStatusForTask {\n    members {\n      _id\n      username\n      isOnServer\n    }\n  }\n"): (typeof documents)["\n  query getMemberOnServerStatusForTask {\n    members {\n      _id\n      username\n      isOnServer\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getChannels {\n    channels {\n      channelId\n      category\n    }\n  }\n"): (typeof documents)["\n  query getChannels {\n    channels {\n      channelId\n      category\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRoles {\n    roles {\n      roleId\n      category\n    }\n  }\n"): (typeof documents)["\n  query getRoles {\n    roles {\n      roleId\n      category\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;