/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date without time */
  Date: { input: string; output: string; }
};

export type ActivityPoints = {
  __typename?: 'ActivityPoints';
  count: Scalars['Int']['output'];
  progress: TierUpdate;
};

export type ChannelMessageCount = {
  __typename?: 'ChannelMessageCount';
  channelId: Scalars['String']['output'];
  messageCount: Scalars['Int']['output'];
};

export type DiscordActivity = {
  __typename?: 'DiscordActivity';
  messages: DiscordMessageActivity;
  monthVoiceMinute: Scalars['Int']['output'];
  points: ActivityPoints;
  tier: Scalars['Int']['output'];
  voiceMinute: Scalars['Int']['output'];
};

export type DiscordMessageActivity = {
  __typename?: 'DiscordMessageActivity';
  monthCount: Scalars['Int']['output'];
  perChannel: Array<ChannelMessageCount>;
  totalCount: Scalars['Int']['output'];
};

export type MainChannel = {
  __typename?: 'MainChannel';
  category: Scalars['String']['output'];
  channelId: Scalars['ID']['output'];
};

export type MainRole = {
  __typename?: 'MainRole';
  category: Scalars['String']['output'];
  roleId: Scalars['ID']['output'];
};

export type Member = {
  __typename?: 'Member';
  _id: Scalars['String']['output'];
  activity: DiscordActivity;
  birthday?: Maybe<Scalars['Date']['output']>;
  isOnServer: Scalars['Boolean']['output'];
  profilePicture: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type MemberInput = {
  birthday?: InputMaybe<Scalars['Date']['input']>;
  isOnServer?: InputMaybe<Scalars['Boolean']['input']>;
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addChannel: Scalars['Boolean']['output'];
  addPresenceMessage: Scalars['Boolean']['output'];
  addRole: Scalars['Boolean']['output'];
  createMember?: Maybe<Member>;
  incMemberDiscordActivityChannel: Scalars['Int']['output'];
  incMemberDiscordVoiceMinute: Scalars['Int']['output'];
  removeChannel: Scalars['Boolean']['output'];
  removePresenceMessage: Scalars['Boolean']['output'];
  removeRole: Scalars['Boolean']['output'];
  setServerActivityMemberCount: Scalars['Boolean']['output'];
  updateMember: Scalars['Boolean']['output'];
};


export type MutationAddChannelArgs = {
  category: Scalars['String']['input'];
  channelId: Scalars['ID']['input'];
};


export type MutationAddPresenceMessageArgs = {
  text: Scalars['String']['input'];
  type: PresenceType;
};


export type MutationAddRoleArgs = {
  category: Scalars['String']['input'];
  roleId: Scalars['ID']['input'];
};


export type MutationCreateMemberArgs = {
  id: Scalars['ID']['input'];
  isOnServer?: InputMaybe<Scalars['Boolean']['input']>;
  profilePicture: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationIncMemberDiscordActivityChannelArgs = {
  channelId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type MutationIncMemberDiscordVoiceMinuteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveChannelArgs = {
  channelId: Scalars['ID']['input'];
};


export type MutationRemovePresenceMessageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveRoleArgs = {
  roleId: Scalars['ID']['input'];
};


export type MutationSetServerActivityMemberCountArgs = {
  count: Scalars['Int']['input'];
};


export type MutationUpdateMemberArgs = {
  id: Scalars['ID']['input'];
  input: MemberInput;
};

export type PresenceMessage = {
  __typename?: 'PresenceMessage';
  _id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  type: PresenceType;
};

export enum PresenceType {
  Competing = 'COMPETING',
  Listening = 'LISTENING',
  Playing = 'PLAYING',
  Watching = 'WATCHING'
}

export type Query = {
  __typename?: 'Query';
  channels: Array<MainChannel>;
  member?: Maybe<Member>;
  members: Array<Member>;
  presenceMessages: Array<PresenceMessage>;
  roles: Array<MainRole>;
  serverActivity: Array<ServerActivity>;
  todayServerActivity: ServerActivity;
};


export type QueryMemberArgs = {
  id: Scalars['ID']['input'];
};


export type QueryServerActivityArgs = {
  historyCount: Scalars['Int']['input'];
};

export type ServerActivity = {
  __typename?: 'ServerActivity';
  date: Scalars['Date']['output'];
  memberCount: Scalars['Int']['output'];
  messageCount: Scalars['Int']['output'];
  voiceMinute: Scalars['Int']['output'];
};

export enum TierUpdate {
  Down = 'DOWN',
  Neutral = 'NEUTRAL',
  Up = 'UP'
}

export type GetBirthdaysForListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBirthdaysForListQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, birthday?: string | null, profilePicture: string }> };

export type GetBirthdaysForNextQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBirthdaysForNextQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, birthday?: string | null, profilePicture: string }> };

export type SetBirthdayMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  date: Scalars['Date']['input'];
}>;


export type SetBirthdayMutation = { __typename?: 'Mutation', updateMember: boolean };

export type GetMemberForInactiveCommandQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMemberForInactiveCommandQuery = { __typename?: 'Query', member?: { __typename?: 'Member', _id: string, activity: { __typename?: 'DiscordActivity', tier: number, voiceMinute: number, monthVoiceMinute: number, messages: { __typename?: 'DiscordMessageActivity', totalCount: number, monthCount: number } } } | null };

export type GetMonthActivityForCommandQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMonthActivityForCommandQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, activity: { __typename?: 'DiscordActivity', monthVoiceMinute: number, messages: { __typename?: 'DiscordMessageActivity', monthCount: number } } }> };

export type AddChannelMutationVariables = Exact<{
  channelId: Scalars['ID']['input'];
  category: Scalars['String']['input'];
}>;


export type AddChannelMutation = { __typename?: 'Mutation', addChannel: boolean };

export type AddRoleMutationVariables = Exact<{
  roleId: Scalars['ID']['input'];
  category: Scalars['String']['input'];
}>;


export type AddRoleMutation = { __typename?: 'Mutation', addRole: boolean };

export type RemoveChannelForCommandRemoveMutationVariables = Exact<{
  channelId: Scalars['ID']['input'];
}>;


export type RemoveChannelForCommandRemoveMutation = { __typename?: 'Mutation', removeChannel: boolean };

export type RemoveRoleForEventMutationVariables = Exact<{
  roleId: Scalars['ID']['input'];
}>;


export type RemoveRoleForEventMutation = { __typename?: 'Mutation', removeRole: boolean };

export type GetMemberForCommandQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMemberForCommandQuery = { __typename?: 'Query', member?: { __typename?: 'Member', _id: string, birthday?: string | null, activity: { __typename?: 'DiscordActivity', tier: number, voiceMinute: number, monthVoiceMinute: number, messages: { __typename?: 'DiscordMessageActivity', totalCount: number, monthCount: number, perChannel: Array<{ __typename?: 'ChannelMessageCount', channelId: string, messageCount: number }> }, points: { __typename?: 'ActivityPoints', progress: TierUpdate } } } | null };

export type GetServerActivityHistoryQueryVariables = Exact<{
  historyCount: Scalars['Int']['input'];
}>;


export type GetServerActivityHistoryQuery = { __typename?: 'Query', serverActivity: Array<{ __typename?: 'ServerActivity', date: string, voiceMinute: number, messageCount: number, memberCount: number }> };

export type GetChannelMessageCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChannelMessageCountQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, activity: { __typename?: 'DiscordActivity', messages: { __typename?: 'DiscordMessageActivity', perChannel: Array<{ __typename?: 'ChannelMessageCount', channelId: string, messageCount: number }> } } }> };

export type GetMonthMessageCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMonthMessageCountQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, activity: { __typename?: 'DiscordActivity', messages: { __typename?: 'DiscordMessageActivity', monthCount: number } } }> };

export type GetTotalMessageCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTotalMessageCountQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, activity: { __typename?: 'DiscordActivity', messages: { __typename?: 'DiscordMessageActivity', totalCount: number } } }> };

export type GetMonthVoiceMinuteQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMonthVoiceMinuteQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, activity: { __typename?: 'DiscordActivity', monthVoiceMinute: number } }> };

export type GetVoiceTimeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVoiceTimeQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, activity: { __typename?: 'DiscordActivity', voiceMinute: number } }> };

export type RemoveChannelMutationVariables = Exact<{
  channelId: Scalars['ID']['input'];
}>;


export type RemoveChannelMutation = { __typename?: 'Mutation', removeChannel: boolean };

export type CreateMemberForEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  username: Scalars['String']['input'];
  profilePicture: Scalars['String']['input'];
}>;


export type CreateMemberForEventMutation = { __typename?: 'Mutation', createMember?: { __typename?: 'Member', _id: string } | null };

export type GetMemberActivityTierEventQueryVariables = Exact<{
  memberId: Scalars['ID']['input'];
}>;


export type GetMemberActivityTierEventQuery = { __typename?: 'Query', member?: { __typename?: 'Member', activity: { __typename?: 'DiscordActivity', tier: number } } | null };

export type SetAlwaysOnServerForEventAddMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  value: Scalars['Boolean']['input'];
}>;


export type SetAlwaysOnServerForEventAddMutation = { __typename?: 'Mutation', updateMember: boolean };

export type SetAlwaysOnServerForEventRemoveMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  value: Scalars['Boolean']['input'];
}>;


export type SetAlwaysOnServerForEventRemoveMutation = { __typename?: 'Mutation', updateMember: boolean };

export type IncChannelMessageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  channelId: Scalars['ID']['input'];
}>;


export type IncChannelMessageMutation = { __typename?: 'Mutation', incMemberDiscordActivityChannel: number };

export type RemoveRoleMutationVariables = Exact<{
  roleId: Scalars['ID']['input'];
}>;


export type RemoveRoleMutation = { __typename?: 'Mutation', removeRole: boolean };

export type SetUsernameAndProfilePictureMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  username: Scalars['String']['input'];
  profilePicture: Scalars['String']['input'];
}>;


export type SetUsernameAndProfilePictureMutation = { __typename?: 'Mutation', updateMember: boolean };

export type IncVoiceMinuteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type IncVoiceMinuteMutation = { __typename?: 'Mutation', incMemberDiscordVoiceMinute: number };

export type SetMemberCountMutationVariables = Exact<{
  count: Scalars['Int']['input'];
}>;


export type SetMemberCountMutation = { __typename?: 'Mutation', setServerActivityMemberCount: boolean };

export type GetBirthdaysForTaskQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBirthdaysForTaskQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, birthday?: string | null, profilePicture: string }> };

export type GetMemberTierForTaskGameQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMemberTierForTaskGameQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, activity: { __typename?: 'DiscordActivity', tier: number } }> };

export type GetMemberTierForTaskQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMemberTierForTaskQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, activity: { __typename?: 'DiscordActivity', tier: number } }> };

export type CreateMemberForTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  username: Scalars['String']['input'];
  profilePicture: Scalars['String']['input'];
}>;


export type CreateMemberForTaskMutation = { __typename?: 'Mutation', createMember?: { __typename?: 'Member', _id: string } | null };

export type SetAlwaysOnServerForTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  value: Scalars['Boolean']['input'];
}>;


export type SetAlwaysOnServerForTaskMutation = { __typename?: 'Mutation', updateMember: boolean };

export type GetMemberForTaskQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMemberForTaskQuery = { __typename?: 'Query', member?: { __typename?: 'Member', _id: string } | null };

export type GetMemberOnServerStatusForTaskQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMemberOnServerStatusForTaskQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, isOnServer: boolean }> };

export type GetChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChannelsQuery = { __typename?: 'Query', channels: Array<{ __typename?: 'MainChannel', channelId: string, category: string }> };

export type GetRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRolesQuery = { __typename?: 'Query', roles: Array<{ __typename?: 'MainRole', roleId: string, category: string }> };


export const GetBirthdaysForListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBirthdaysForList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"birthday"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]}}]} as unknown as DocumentNode<GetBirthdaysForListQuery, GetBirthdaysForListQueryVariables>;
export const GetBirthdaysForNextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBirthdaysForNext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"birthday"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]}}]} as unknown as DocumentNode<GetBirthdaysForNextQuery, GetBirthdaysForNextQueryVariables>;
export const SetBirthdayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setBirthday"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"birthday"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}}]}]}}]} as unknown as DocumentNode<SetBirthdayMutation, SetBirthdayMutationVariables>;
export const GetMemberForInactiveCommandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMemberForInactiveCommand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"voiceMinute"}},{"kind":"Field","name":{"kind":"Name","value":"monthVoiceMinute"}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"monthCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMemberForInactiveCommandQuery, GetMemberForInactiveCommandQueryVariables>;
export const GetMonthActivityForCommandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMonthActivityForCommand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthVoiceMinute"}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMonthActivityForCommandQuery, GetMonthActivityForCommandQueryVariables>;
export const AddChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}}]}]}}]} as unknown as DocumentNode<AddChannelMutation, AddChannelMutationVariables>;
export const AddRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}}]}]}}]} as unknown as DocumentNode<AddRoleMutation, AddRoleMutationVariables>;
export const RemoveChannelForCommandRemoveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeChannelForCommandRemove"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}]}]}}]} as unknown as DocumentNode<RemoveChannelForCommandRemoveMutation, RemoveChannelForCommandRemoveMutationVariables>;
export const RemoveRoleForEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeRoleForEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}}]}]}}]} as unknown as DocumentNode<RemoveRoleForEventMutation, RemoveRoleForEventMutationVariables>;
export const GetMemberForCommandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMemberForCommand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"birthday"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"voiceMinute"}},{"kind":"Field","name":{"kind":"Name","value":"monthVoiceMinute"}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"monthCount"}},{"kind":"Field","name":{"kind":"Name","value":"perChannel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelId"}},{"kind":"Field","name":{"kind":"Name","value":"messageCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"progress"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMemberForCommandQuery, GetMemberForCommandQueryVariables>;
export const GetServerActivityHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getServerActivityHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"historyCount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"historyCount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"historyCount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"voiceMinute"}},{"kind":"Field","name":{"kind":"Name","value":"messageCount"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}}]}}]} as unknown as DocumentNode<GetServerActivityHistoryQuery, GetServerActivityHistoryQueryVariables>;
export const GetChannelMessageCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChannelMessageCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perChannel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelId"}},{"kind":"Field","name":{"kind":"Name","value":"messageCount"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetChannelMessageCountQuery, GetChannelMessageCountQueryVariables>;
export const GetMonthMessageCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMonthMessageCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMonthMessageCountQuery, GetMonthMessageCountQueryVariables>;
export const GetTotalMessageCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTotalMessageCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetTotalMessageCountQuery, GetTotalMessageCountQueryVariables>;
export const GetMonthVoiceMinuteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMonthVoiceMinute"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthVoiceMinute"}}]}}]}}]}}]} as unknown as DocumentNode<GetMonthVoiceMinuteQuery, GetMonthVoiceMinuteQueryVariables>;
export const GetVoiceTimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getVoiceTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"voiceMinute"}}]}}]}}]}}]} as unknown as DocumentNode<GetVoiceTimeQuery, GetVoiceTimeQueryVariables>;
export const RemoveChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}]}]}}]} as unknown as DocumentNode<RemoveChannelMutation, RemoveChannelMutationVariables>;
export const CreateMemberForEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createMemberForEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<CreateMemberForEventMutation, CreateMemberForEventMutationVariables>;
export const GetMemberActivityTierEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMemberActivityTierEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tier"}}]}}]}}]}}]} as unknown as DocumentNode<GetMemberActivityTierEventQuery, GetMemberActivityTierEventQueryVariables>;
export const SetAlwaysOnServerForEventAddDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setAlwaysOnServerForEventAdd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isOnServer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}]}}]}]}}]} as unknown as DocumentNode<SetAlwaysOnServerForEventAddMutation, SetAlwaysOnServerForEventAddMutationVariables>;
export const SetAlwaysOnServerForEventRemoveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setAlwaysOnServerForEventRemove"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isOnServer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}]}}]}]}}]} as unknown as DocumentNode<SetAlwaysOnServerForEventRemoveMutation, SetAlwaysOnServerForEventRemoveMutationVariables>;
export const IncChannelMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"incChannelMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incMemberDiscordActivityChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}]}]}}]} as unknown as DocumentNode<IncChannelMessageMutation, IncChannelMessageMutationVariables>;
export const RemoveRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}}]}]}}]} as unknown as DocumentNode<RemoveRoleMutation, RemoveRoleMutationVariables>;
export const SetUsernameAndProfilePictureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setUsernameAndProfilePicture"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}]}}]}]}}]} as unknown as DocumentNode<SetUsernameAndProfilePictureMutation, SetUsernameAndProfilePictureMutationVariables>;
export const IncVoiceMinuteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"incVoiceMinute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incMemberDiscordVoiceMinute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<IncVoiceMinuteMutation, IncVoiceMinuteMutationVariables>;
export const SetMemberCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setMemberCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setServerActivityMemberCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}}]}]}}]} as unknown as DocumentNode<SetMemberCountMutation, SetMemberCountMutationVariables>;
export const GetBirthdaysForTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBirthdaysForTask"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"birthday"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]}}]} as unknown as DocumentNode<GetBirthdaysForTaskQuery, GetBirthdaysForTaskQueryVariables>;
export const GetMemberTierForTaskGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMemberTierForTaskGame"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tier"}}]}}]}}]}}]} as unknown as DocumentNode<GetMemberTierForTaskGameQuery, GetMemberTierForTaskGameQueryVariables>;
export const GetMemberTierForTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMemberTierForTask"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tier"}}]}}]}}]}}]} as unknown as DocumentNode<GetMemberTierForTaskQuery, GetMemberTierForTaskQueryVariables>;
export const CreateMemberForTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createMemberForTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<CreateMemberForTaskMutation, CreateMemberForTaskMutationVariables>;
export const SetAlwaysOnServerForTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setAlwaysOnServerForTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isOnServer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}]}}]}]}}]} as unknown as DocumentNode<SetAlwaysOnServerForTaskMutation, SetAlwaysOnServerForTaskMutationVariables>;
export const GetMemberForTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMemberForTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<GetMemberForTaskQuery, GetMemberForTaskQueryVariables>;
export const GetMemberOnServerStatusForTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMemberOnServerStatusForTask"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"isOnServer"}}]}}]}}]} as unknown as DocumentNode<GetMemberOnServerStatusForTaskQuery, GetMemberOnServerStatusForTaskQueryVariables>;
export const GetChannelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChannels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelId"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]} as unknown as DocumentNode<GetChannelsQuery, GetChannelsQueryVariables>;
export const GetRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]} as unknown as DocumentNode<GetRolesQuery, GetRolesQueryVariables>;