'use strict';

const { ChannelType } = require('../../Publish02/api');
const { lazy } = require('./Util');
const getCategoryChannel = lazy(() => require('../Structures/CategoryChannel'));
const getDMChannel = lazy(() => require('../Structures/DMChannel'));
const getNewsChannel = lazy(() => require('../Structures/NewsChannel'));
const getStageChannel = lazy(() => require('../Structures/StageChannel'));
const getTextChannel = lazy(() => require('../Structures/TextChannel'));
const getThreadChannel = lazy(() => require('../Structures/ThreadChannel'));
const getVoiceChannel = lazy(() => require('../Structures/VoiceChannel'));
const getDirectoryChannel = lazy(() => require('../Structures/DirectoryChannel'));
const getPartialGroupDMChannel = lazy(() => require('../Structures/PartialGroupDMChannel'));

/**
 * Creates a discord.js channel from data received from the API.
 * @param {Client} client The client
 * @param {APIChannel} data The data of the channel to create
 * @param {Guild} [guild] The guild where this channel belongs
 * @param {Object} [extras] Extra information to supply for creating this channel
 * @returns {Channel} Any kind of channel.
 * @ignore
 */
function createChannel(client, data, guild, { allowUnknownGuild, fromInteraction } = {}) {
  let channel;
  if (!data.guild_id && !guild) {
    if ((data.recipients && data.type !== ChannelType.GroupDM) || data.type === ChannelType.DM) {
      channel = new (getDMChannel())(client, data);
    } else if (data.type === ChannelType.GroupDM) {
      channel = new (getPartialGroupDMChannel())(client, data);
    }
  } else {
    guild ??= client.guilds.cache.get(data.guild_id);

    if (guild || allowUnknownGuild) {
      switch (data.type) {
        case ChannelType.GuildText: {
          channel = new (getTextChannel())(guild, data, client);
          break;
        }
        case ChannelType.GuildVoice: {
          channel = new (getVoiceChannel())(guild, data, client);
          break;
        }
        case ChannelType.GuildCategory: {
          channel = new (getCategoryChannel())(guild, data, client);
          break;
        }
        case ChannelType.GuildNews: {
          channel = new (getNewsChannel())(guild, data, client);
          break;
        }
        case ChannelType.GuildStageVoice: {
          channel = new (getStageChannel())(guild, data, client);
          break;
        }
        case ChannelType.GuildNewsThread:
        case ChannelType.GuildPublicThread:
        case ChannelType.GuildPrivateThread: {
          channel = new (getThreadChannel())(guild, data, client, fromInteraction);
          if (!allowUnknownGuild) channel.parent?.threads.cache.set(channel.id, channel);
          break;
        }
        case ChannelType.GuildDirectory:
          channel = new (getDirectoryChannel())(guild, data, client);
          break;
      }
      if (channel && !allowUnknownGuild) guild.channels?.cache.set(channel.id, channel);
    }
  }
  return channel;
}

module.exports = {
  createChannel,
};
