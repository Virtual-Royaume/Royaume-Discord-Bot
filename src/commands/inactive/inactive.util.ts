import type { GuildMember, Snowflake } from "discord.js";
import type { Page } from "./inactive.type";
import type { GetMonthActivityQuery } from "#/utils/request";
import { reasonId } from "./inactive.const";
import { interactionId } from "#/configs/global";
import { guilds } from "#/configs/guild";
import { commands } from "#/configs/message/command";
import { objectKeys } from "#/utils/function/object";
import { msgParams } from "#/utils/message";
import { gqlRequest } from "#/utils/request";
import { Collection,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import { getMember, getMonthActivity } from "./inactive.gql";

export const pageNumberByMember: Collection<Snowflake, number> = new Collection();

export const getPage = async(members: GuildMember[], page: number): Promise<Page | null> => {
  const maxPage = members.length;
  page = page > maxPage ? maxPage : page;
  page = page < 0 ? 1 : page;
  const guildMember = members[page - 1];
  const memberQuery = await gqlRequest(getMember, { id: guildMember.id });

  if (!memberQuery.ok || !memberQuery.value.member) {
    return null;
  }

  const member = memberQuery.value.member;
  const user = await guildMember.user.fetch();

  return {
    maxPage,
    page,
    data: {
      previousMember: members[page - 2] ? members[page - 2].user.username : undefined,
      nextMember: members[page] ? members[page].user.username : undefined,
      memberId: member._id,
      username: user.tag,
      messages: member.activity.messages.totalCount,
      minutes: member.activity.voiceMinute,
      createAt: user.createdAt,
      joinServerAt: guildMember.joinedAt,
      avatar: user.avatarURL(),
      banner: user.bannerURL() ?? null,
      tier: objectKeys(guilds.pro.tiers)[member.activity.tier]
    }
  };
};

export const getEmbed = (page: Page): EmbedBuilder => {

  const fields = commands.inactive.exec.embed.fields;
  const embed = new EmbedBuilder()
    .setTitle(page.data.username)
    .addFields([
      {
        name: fields.member.name,
        value: msgParams(fields.member.value, [page.data.memberId]),
        inline: true
      },
      {
        name: fields.createAt.name,
        value: msgParams(fields.createAt.value, [page.data.createAt.toLocaleDateString()]),
        inline: true
      },
      {
        name: fields.joinAt.name,
        value: msgParams(fields.joinAt.value, [page.data.joinServerAt?.toLocaleDateString() ?? fields.joinAt.defaultValue]),
        inline: true
      },
      {
        name: fields.messages.name,
        value: msgParams(fields.messages.value, [page.data.messages]),
        inline: true
      },
      {
        name: fields.minutes.name,
        value: msgParams(fields.minutes.value, [page.data.minutes]),
        inline: true
      },
      {
        name: fields.activityTier.name,
        value: msgParams(fields.activityTier.value, [guilds.pro.tiers[page.data.tier]]),
        inline: true
      }
    ])
    .setColor("#5339DD")
    .setFooter({
      text: msgParams(commands.inactive.exec.embed.footer, [page.page, page.maxPage])
    });

  if (page.data.avatar) {
    embed.setThumbnail(page.data.avatar);
  }

  if (page.data.banner) {
    embed.setImage(page.data.banner + "?size=512");
  }

  return embed;
};

export const getActionRow = (page: Page, canKick = false): ActionRowBuilder<ButtonBuilder> => {
  const actions = interactionId.button.inactive;

  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    // Beginning page
    new ButtonBuilder()
      .setCustomId(actions.inactiveFirst)
      .setLabel("⏪")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page.page === 1),

    // Previous
    new ButtonBuilder()
      .setCustomId(actions.inactivePrevious)
      .setLabel(!page.data.previousMember ? "◀️" : `◀️ (${page.data.previousMember})`)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!page.data.previousMember),

    // Kick
    new ButtonBuilder()
      .setCustomId(actions.inactiveKick)
      .setLabel("Expulser")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(!canKick),

    // Next
    new ButtonBuilder()
      .setCustomId(actions.inactiveNext)
      .setLabel(!page.data.nextMember ? "▶️" : `▶️ (${page.data.nextMember})`)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!page.data.nextMember),

    // Last page
    new ButtonBuilder()
      .setCustomId(actions.inactiveLast)
      .setLabel("⏩")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!page.data.nextMember)
  );
};

export const confirmationModal = (username: string): ModalBuilder => {
  return new ModalBuilder()
    .setCustomId(interactionId.modal.inactive)
    .setTitle(msgParams(commands.inactive.exec.modal.title, [username]))
    .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(reasonId)
        .setLabel(commands.inactive.exec.modal.label)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setPlaceholder(commands.inactive.exec.kick.kickDefaultReason)
        .setRequired(false)
    ));
};

export const getInactiveMembers = async(): Promise<GetMonthActivityQuery["members"] | null> => {
  const monthActivityQuery = await gqlRequest(getMonthActivity);

  if (!monthActivityQuery.ok) return null;

  const inactiveMembers = monthActivityQuery.value.members.filter(member => {
    const monthMessage = member.activity?.messages.monthCount;
    const monthVoice = member.activity?.monthVoiceMinute;

    return !monthMessage && !monthVoice;
  });

  return inactiveMembers;
};