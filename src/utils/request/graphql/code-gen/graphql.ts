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

export type AddChannelMutationVariables = Exact<{
  channelId: Scalars['ID']['input'];
  category: Scalars['String']['input'];
}>;


export type AddChannelMutation = { __typename?: 'Mutation', addChannel: boolean };

export type RemoveChannelMutationVariables = Exact<{
  channelId: Scalars['ID']['input'];
}>;


export type RemoveChannelMutation = { __typename?: 'Mutation', removeChannel: boolean };

export type GetChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChannelsQuery = { __typename?: 'Query', channels: Array<{ __typename?: 'MainChannel', channelId: string, category: string }> };

export type AddRoleMutationVariables = Exact<{
  roleId: Scalars['ID']['input'];
  category: Scalars['String']['input'];
}>;


export type AddRoleMutation = { __typename?: 'Mutation', addRole: boolean };

export type RemoveRoleMutationVariables = Exact<{
  roleId: Scalars['ID']['input'];
}>;


export type RemoveRoleMutation = { __typename?: 'Mutation', removeRole: boolean };

export type GetRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRolesQuery = { __typename?: 'Query', roles: Array<{ __typename?: 'MainRole', roleId: string, category: string }> };

export type CreateMemberMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  username: Scalars['String']['input'];
  profilePicture: Scalars['String']['input'];
}>;


export type CreateMemberMutation = { __typename?: 'Mutation', createMember?: { __typename?: 'Member', _id: string } | null };

export type SetAlwaysOnServerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  value: Scalars['Boolean']['input'];
}>;


export type SetAlwaysOnServerMutation = { __typename?: 'Mutation', updateMember: boolean };

export type SetUsernameAndProfilePictureMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  username: Scalars['String']['input'];
  profilePicture: Scalars['String']['input'];
}>;


export type SetUsernameAndProfilePictureMutation = { __typename?: 'Mutation', updateMember: boolean };

export type SetBirthdayMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  date: Scalars['Date']['input'];
}>;


export type SetBirthdayMutation = { __typename?: 'Mutation', updateMember: boolean };

export type IncChannelMessageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  channelId: Scalars['ID']['input'];
}>;


export type IncChannelMessageMutation = { __typename?: 'Mutation', incMemberDiscordActivityChannel: number };

export type IncVoiceMinuteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type IncVoiceMinuteMutation = { __typename?: 'Mutation', incMemberDiscordVoiceMinute: number };

export type GetMemberQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMemberQuery = { __typename?: 'Query', member?: { __typename?: 'Member', _id: string, username: string, profilePicture: string, birthday?: string | null, isOnServer: boolean, activity: { __typename?: 'DiscordActivity', tier: number, voiceMinute: number, monthVoiceMinute: number, messages: { __typename?: 'DiscordMessageActivity', totalCount: number, monthCount: number, perChannel: Array<{ __typename?: 'ChannelMessageCount', channelId: string, messageCount: number }> }, points: { __typename?: 'ActivityPoints', count: number, progress: TierUpdate } } } | null };

export type GetMemberTierQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMemberTierQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, activity: { __typename?: 'DiscordActivity', tier: number } }> };

export type GetMemberOnServerStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMemberOnServerStatusQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, isOnServer: boolean }> };

export type GetBirthdaysQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBirthdaysQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, birthday?: string | null, profilePicture: string }> };

export type GetVoiceTimeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVoiceTimeQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, activity: { __typename?: 'DiscordActivity', voiceMinute: number } }> };

export type GetMonthMessageCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMonthMessageCountQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, activity: { __typename?: 'DiscordActivity', messages: { __typename?: 'DiscordMessageActivity', monthCount: number } } }> };

export type GetMonthVoiceMinuteQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMonthVoiceMinuteQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, activity: { __typename?: 'DiscordActivity', monthVoiceMinute: number } }> };

export type GetMonthActivityQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMonthActivityQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, activity: { __typename?: 'DiscordActivity', monthVoiceMinute: number, messages: { __typename?: 'DiscordMessageActivity', monthCount: number } } }> };

export type GetTotalMessageCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTotalMessageCountQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, activity: { __typename?: 'DiscordActivity', messages: { __typename?: 'DiscordMessageActivity', totalCount: number } } }> };

export type GetChannelMessageCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChannelMessageCountQuery = { __typename?: 'Query', members: Array<{ __typename?: 'Member', _id: string, username: string, activity: { __typename?: 'DiscordActivity', messages: { __typename?: 'DiscordMessageActivity', perChannel: Array<{ __typename?: 'ChannelMessageCount', channelId: string, messageCount: number }> } } }> };

export type GetMemberActivityTierQueryVariables = Exact<{
  memberId: Scalars['ID']['input'];
}>;


export type GetMemberActivityTierQuery = { __typename?: 'Query', member?: { __typename?: 'Member', activity: { __typename?: 'DiscordActivity', tier: number } } | null };

export type GetPresenceMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPresenceMessagesQuery = { __typename?: 'Query', presenceMessages: Array<{ __typename?: 'PresenceMessage', _id: string, type: PresenceType, text: string }> };

export type AddPresenceMessageMutationVariables = Exact<{
  type: PresenceType;
  text: Scalars['String']['input'];
}>;


export type AddPresenceMessageMutation = { __typename?: 'Mutation', addPresenceMessage: boolean };

export type RemoePresenceMessageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoePresenceMessageMutation = { __typename?: 'Mutation', removePresenceMessage: boolean };

export type GetCurrentServerActivityQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentServerActivityQuery = { __typename?: 'Query', todayServerActivity: { __typename?: 'ServerActivity', date: string, voiceMinute: number, messageCount: number, memberCount: number } };

export type GetServerActivityHistoryQueryVariables = Exact<{
  historyCount: Scalars['Int']['input'];
}>;


export type GetServerActivityHistoryQuery = { __typename?: 'Query', serverActivity: Array<{ __typename?: 'ServerActivity', date: string, voiceMinute: number, messageCount: number, memberCount: number }> };

export type SetMemberCountMutationVariables = Exact<{
  count: Scalars['Int']['input'];
}>;


export type SetMemberCountMutation = { __typename?: 'Mutation', setServerActivityMemberCount: boolean };


export const AddChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}}]}]}}]} as unknown as DocumentNode<AddChannelMutation, AddChannelMutationVariables>;
export const RemoveChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}]}]}}]} as unknown as DocumentNode<RemoveChannelMutation, RemoveChannelMutationVariables>;
export const GetChannelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChannels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelId"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]} as unknown as DocumentNode<GetChannelsQuery, GetChannelsQueryVariables>;
export const AddRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}}]}]}}]} as unknown as DocumentNode<AddRoleMutation, AddRoleMutationVariables>;
export const RemoveRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}}]}]}}]} as unknown as DocumentNode<RemoveRoleMutation, RemoveRoleMutationVariables>;
export const GetRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]} as unknown as DocumentNode<GetRolesQuery, GetRolesQueryVariables>;
export const CreateMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<CreateMemberMutation, CreateMemberMutationVariables>;
export const SetAlwaysOnServerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setAlwaysOnServer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isOnServer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}]}}]}]}}]} as unknown as DocumentNode<SetAlwaysOnServerMutation, SetAlwaysOnServerMutationVariables>;
export const SetUsernameAndProfilePictureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setUsernameAndProfilePicture"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}]}}]}]}}]} as unknown as DocumentNode<SetUsernameAndProfilePictureMutation, SetUsernameAndProfilePictureMutationVariables>;
export const SetBirthdayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setBirthday"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"birthday"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}}]}]}}]} as unknown as DocumentNode<SetBirthdayMutation, SetBirthdayMutationVariables>;
export const IncChannelMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"incChannelMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incMemberDiscordActivityChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}]}]}}]} as unknown as DocumentNode<IncChannelMessageMutation, IncChannelMessageMutationVariables>;
export const IncVoiceMinuteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"incVoiceMinute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incMemberDiscordVoiceMinute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<IncVoiceMinuteMutation, IncVoiceMinuteMutationVariables>;
export const GetMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"birthday"}},{"kind":"Field","name":{"kind":"Name","value":"isOnServer"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"voiceMinute"}},{"kind":"Field","name":{"kind":"Name","value":"monthVoiceMinute"}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"monthCount"}},{"kind":"Field","name":{"kind":"Name","value":"perChannel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelId"}},{"kind":"Field","name":{"kind":"Name","value":"messageCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMemberQuery, GetMemberQueryVariables>;
export const GetMemberTierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMemberTier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tier"}}]}}]}}]}}]} as unknown as DocumentNode<GetMemberTierQuery, GetMemberTierQueryVariables>;
export const GetMemberOnServerStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMemberOnServerStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"isOnServer"}}]}}]}}]} as unknown as DocumentNode<GetMemberOnServerStatusQuery, GetMemberOnServerStatusQueryVariables>;
export const GetBirthdaysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBirthdays"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"birthday"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]}}]} as unknown as DocumentNode<GetBirthdaysQuery, GetBirthdaysQueryVariables>;
export const GetVoiceTimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getVoiceTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"voiceMinute"}}]}}]}}]}}]} as unknown as DocumentNode<GetVoiceTimeQuery, GetVoiceTimeQueryVariables>;
export const GetMonthMessageCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMonthMessageCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMonthMessageCountQuery, GetMonthMessageCountQueryVariables>;
export const GetMonthVoiceMinuteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMonthVoiceMinute"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthVoiceMinute"}}]}}]}}]}}]} as unknown as DocumentNode<GetMonthVoiceMinuteQuery, GetMonthVoiceMinuteQueryVariables>;
export const GetMonthActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMonthActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthVoiceMinute"}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMonthActivityQuery, GetMonthActivityQueryVariables>;
export const GetTotalMessageCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTotalMessageCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetTotalMessageCountQuery, GetTotalMessageCountQueryVariables>;
export const GetChannelMessageCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChannelMessageCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perChannel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelId"}},{"kind":"Field","name":{"kind":"Name","value":"messageCount"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetChannelMessageCountQuery, GetChannelMessageCountQueryVariables>;
export const GetMemberActivityTierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMemberActivityTier"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tier"}}]}}]}}]}}]} as unknown as DocumentNode<GetMemberActivityTierQuery, GetMemberActivityTierQueryVariables>;
export const GetPresenceMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPresenceMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"presenceMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<GetPresenceMessagesQuery, GetPresenceMessagesQueryVariables>;
export const AddPresenceMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addPresenceMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PresenceType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addPresenceMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}]}]}}]} as unknown as DocumentNode<AddPresenceMessageMutation, AddPresenceMessageMutationVariables>;
export const RemoePresenceMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"remoePresenceMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePresenceMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoePresenceMessageMutation, RemoePresenceMessageMutationVariables>;
export const GetCurrentServerActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCurrentServerActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"todayServerActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"voiceMinute"}},{"kind":"Field","name":{"kind":"Name","value":"messageCount"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}}]}}]} as unknown as DocumentNode<GetCurrentServerActivityQuery, GetCurrentServerActivityQueryVariables>;
export const GetServerActivityHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getServerActivityHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"historyCount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"historyCount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"historyCount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"voiceMinute"}},{"kind":"Field","name":{"kind":"Name","value":"messageCount"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}}]}}]} as unknown as DocumentNode<GetServerActivityHistoryQuery, GetServerActivityHistoryQueryVariables>;
export const SetMemberCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setMemberCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setServerActivityMemberCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}}]}]}}]} as unknown as DocumentNode<SetMemberCountMutation, SetMemberCountMutationVariables>;