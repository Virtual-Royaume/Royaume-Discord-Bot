export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    Date: any;
};

export type ChannelMessageCount = {
    __typename?: 'ChannelMessageCount';
    channelId: Scalars['String'];
    messageCount: Scalars['Int'];
};

export type DiscordActivity = {
    __typename?: 'DiscordActivity';
    messages: DiscordMessageActivity;
    voiceMinute: Scalars['Int'];
};

export type DiscordMessageActivity = {
    __typename?: 'DiscordMessageActivity';
    monthCount: Scalars['Int'];
    perChannel: Array<Maybe<ChannelMessageCount>>;
    totalCount: Scalars['Int'];
};

export type MainChannel = {
    __typename?: 'MainChannel';
    category: Scalars['String'];
    channelId: Scalars['ID'];
};

export type MainRole = {
    __typename?: 'MainRole';
    category: Scalars['String'];
    roleId: Scalars['ID'];
};

export type Member = {
    __typename?: 'Member';
    _id: Scalars['String'];
    activity: DiscordActivity;
    isOnServer: Scalars['Boolean'];
    profilPicture: Scalars['String'];
    username: Scalars['String'];
};

export type MemberInput = {
    isOnServer?: InputMaybe<Scalars['Boolean']>;
    profilPicture?: InputMaybe<Scalars['String']>;
    username?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
    __typename?: 'Mutation';
    addChannel: Scalars['Boolean'];
    addRole: Scalars['Boolean'];
    createMember?: Maybe<Member>;
    incMemberDiscordActivityChannel: Scalars['Boolean'];
    incMemberDiscordVoiceMinute: Scalars['Boolean'];
    removeChannel: Scalars['Boolean'];
    removeRole: Scalars['Boolean'];
    updateMember: Scalars['Boolean'];
    updateServerActivity: Scalars['Boolean'];
};


export type MutationAddChannelArgs = {
    category: Scalars['String'];
    channelId: Scalars['ID'];
};


export type MutationAddRoleArgs = {
    category: Scalars['String'];
    roleId: Scalars['ID'];
};


export type MutationCreateMemberArgs = {
    id: Scalars['ID'];
    isOnServer?: InputMaybe<Scalars['Boolean']>;
    profilPicture: Scalars['String'];
    username: Scalars['String'];
};


export type MutationIncMemberDiscordActivityChannelArgs = {
    channelId: Scalars['ID'];
    id: Scalars['ID'];
};


export type MutationIncMemberDiscordVoiceMinuteArgs = {
    id: Scalars['ID'];
};


export type MutationRemoveChannelArgs = {
    channelId: Scalars['ID'];
};


export type MutationRemoveRoleArgs = {
    roleId: Scalars['ID'];
};


export type MutationUpdateMemberArgs = {
  id: Scalars['ID'];
  input: MemberInput;
};


export type MutationUpdateServerActivityArgs = {
  input: ServerActivityInput;
};

export type Query = {
  __typename?: 'Query';
  channels?: Maybe<Array<Maybe<MainChannel>>>;
  member?: Maybe<Member>;
  members: Array<Maybe<Member>>;
  roles?: Maybe<Array<Maybe<MainRole>>>;
  serverActivity: Array<Maybe<ServerActivity>>;
  todayServerActivity: ServerActivity;
};


export type QueryMemberArgs = {
  id: Scalars['ID'];
};


export type QueryServerActivityArgs = {
  historyCount: Scalars['Int'];
};

export type ServerActivity = {
  __typename?: 'ServerActivity';
  date: Scalars['Date'];
  memberCount: Scalars['Int'];
  messageCount: Scalars['Int'];
  voiceMinute: Scalars['Int'];
};

export type ServerActivityInput = {
  date: Scalars['Date'];
  memberCount?: InputMaybe<Scalars['Int']>;
  messageCount?: InputMaybe<Scalars['Int']>;
  voiceMinute?: InputMaybe<Scalars['Int']>;
};
