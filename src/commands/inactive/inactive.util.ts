import { getGuild } from "$core/client";
import { Collection, EmbedBuilder, Snowflake } from "discord.js";
import { verify } from "$resources/config/information.json";
import { gqlRequest } from "$core/utils/request";
import { getMember } from "$core/api/requests/member";
import { GetMonthActivityQuery } from "$core/utils/request/graphql/graphql";
import { MemberPage } from "$core/commands/inactive/inactive.type";
import { simpleEmbed } from "$core/utils/embed";
import { commands } from "$resources/config/messages.json";
import { getInactiveMembers } from "$core/api/func/member";
import { formatMinutes } from "$core/utils/function";
import { tiers as configTiers } from "$resources/config/information.json";

export const memberPage: MemberPage = new Collection();

export const getInactiveGuildMembers = async(): Promise<GetMonthActivityQuery["members"] | null> => {
  const guild = await getGuild();
  const members = (await guild.members.fetch()).filter(member => member.roles.cache.has(verify.roles.waiting));
  const inactiveMembersQuery = await getInactiveMembers();

  if (!inactiveMembersQuery) return null;

  const inactiveMembers = inactiveMembersQuery.filter(member => !members.has(member._id));

  return inactiveMembers;
};

export const getValidPageNumber = (inactiveMembers: GetMonthActivityQuery["members"], page: number): number => {
  if (page < 0) return 0;
  if (page >= inactiveMembers.length) return inactiveMembers.length - 1;
  return page;
};

export const generateEmbed = async(member: Snowflake, page: number): Promise<EmbedBuilder> => {
  const inactiveGuildMembers = await getInactiveGuildMembers();

  if (!inactiveGuildMembers) return simpleEmbed(commands.inactive.exec.activityQueryError, "error");

  page = getValidPageNumber(inactiveGuildMembers, page);
  const inactiveId = inactiveGuildMembers[page]._id;
  const memberQuery = await gqlRequest(getMember, { id: inactiveId });

  if (!memberQuery.success) return simpleEmbed(commands.inactive.exec.memberQueryError, "error");

  const memberInfo = memberQuery.data.member;
  const guildMember = await (await getGuild()).members.fetch(inactiveId);

  // Format data:
  const tiers: Record<string, string> = configTiers;
  const messageCount = memberInfo.activity.messages.totalCount;
  const voiceMinute = memberInfo.activity.voiceMinute;
  const avatar = guildMember.user.displayAvatarURL();
  const banner = (await guildMember.user.fetch()).bannerURL();
  const embed = new EmbedBuilder()
    .setTitle(memberInfo.username)
    .setDescription(msg(
      "cmd-inactive-embed-content",
      [
        inactiveId, messageCount, formatMinutes(voiceMinute), memberInstance.user.createdAt.toLocaleDateString(),
        memberInstance.joinedAt?.toLocaleDateString() ?? "0 minutes", tiers[memberInfo.activity.tier]
      ]
    ))
    .setColor("#5339DD")
    .setThumbnail(avatar)
    .setFooter({
      text: msg("cmd-inactive-exec-embed-footer", [page + 1, inactiveMembers.length])
    });

  if (banner) embed.setImage(`${banner}?size=512`);
  return embed;
};