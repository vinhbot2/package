'use strict';
const DjsErrorCodes = require('./ErrorCodes');
const Messages = {
  [DjsErrorCodes.ClientInvalidOption]: (prop, must) => `The ${prop} option must be ${must}`,
  [DjsErrorCodes.ClientInvalidProvidedShards]: 'Không có phân đoạn nào trong số các phân đoạn được cung cấp là hợp lệ.',
  [DjsErrorCodes.ClientMissingIntents]: 'Ý định hợp lệ phải được cung cấp cho Khách hàng(Client).',
  [DjsErrorCodes.ClientNotReady]: action => `(client)Khách hàng cần đăng nhập vào ${action}.`,

  [DjsErrorCodes.TokenInvalid]: '(token bot)Một mã thông báo không hợp lệ đã được cung cấp.',
  [DjsErrorCodes.TokenMissing]: 'Yêu cầu sử dụng mã thông báo(token), nhưng mã thông báo(token) không có sẵn cho khách hàng(client).',
  [DjsErrorCodes.ApplicationCommandPermissionsTokenMissing]: 'Quyền chỉnh sửa lệnh ứng dụng yêu cầu mã thông báo(token) mang OAuth2, nhưng không có mã nào được cung cấp.',
  [DjsErrorCodes.WSCloseRequested]: 'WebSocket đã đóng do yêu cầu của người dùng.',
  [DjsErrorCodes.WSConnectionExists]: 'Đã có kết nối WebSocket hiện tại.',
  [DjsErrorCodes.WSNotOpen]: (data = 'data') => `WebSocket không mở để gửi ${data}`,
  [DjsErrorCodes.ManagerDestroyed]: 'Người quản lý đã bị phá hủy.',
  [DjsErrorCodes.BitFieldInvalid]: bit => `Cờ hoặc số trường bit không hợp lệ: ${bit}.`,

  [DjsErrorCodes.ShardingInvalid]: 'Đã cung cấp cài đặt phân đoạn không hợp lệ.',
  [DjsErrorCodes.ShardingRequired]: 'Phiên này sẽ xử lý quá nhiều bang hội - Cần có Sharding.',
  [DjsErrorCodes.InvalidIntents]: 'Ý định không hợp lệ được cung cấp cho ý định WebSocket.',
  [DjsErrorCodes.DisallowedIntents]: 'Mục đích đặc quyền đã cung cấp không được bật hoặc được đưa vào danh sách trắng.',
  [DjsErrorCodes.ShardingNoShards]: 'Không có mảnh nào được tạo ra.',
  [DjsErrorCodes.ShardingInProcess]: 'Các mảnh vẫn đang được sinh sản.',
  [DjsErrorCodes.ShardingInvalidEvalBroadcast]: 'Tập lệnh để đánh giá phải là một hàm',
  [DjsErrorCodes.ShardingShardNotFound]: id => `Shard ${id} could not be found.`,
  [DjsErrorCodes.ShardingAlreadySpawned]: count => `Already spawned ${count} shards.`,
  [DjsErrorCodes.ShardingProcessExists]: id => `Shard ${id} already has an active process.`,
  [DjsErrorCodes.ShardingWorkerExists]: id => `Shard ${id} already has an active worker.`,
  [DjsErrorCodes.ShardingReadyTimeout]: id => `Shard ${id}'s Client took too long to become ready.`,
  [DjsErrorCodes.ShardingReadyDisconnected]: id => `Shard ${id}'s Client disconnected before becoming ready.`,
  [DjsErrorCodes.ShardingReadyDied]: id => `Shard ${id}'s process exited before its Client became ready.`,
  [DjsErrorCodes.ShardingNoChildExists]: id => `Shard ${id} has no active process or worker.`,
  [DjsErrorCodes.ShardingShardMiscalculation]: (shard, guild, count) => `Calculated invalid shard ${shard} for guild ${guild} with ${count} shards.`,

  [DjsErrorCodes.ColorRange]: 'Màu sắc phải nằm trong phạm vi 0 - 16777215 (0xFFFFFF).',
  [DjsErrorCodes.ColorConvert]: 'Không thể chuyển đổi màu thành một số.',
  [DjsErrorCodes.InviteOptionsMissingChannel]: 'Kênh guild hợp lệ phải được cung cấp khi GuildSchedonedEvent là BÊN NGOÀI.',
  [DjsErrorCodes.ButtonLabel]: 'Nhãn MessageButton phải là một chuỗi',
  [DjsErrorCodes.ButtonURL]: 'URL MessageButton phải là một chuỗi',
  [DjsErrorCodes.ButtonCustomId]: 'MessageButton customId phải là một chuỗi',

  [DjsErrorCodes.SelectMenuCustomId]: 'MessageSelectMenu customId must be a string',
  [DjsErrorCodes.SelectMenuPlaceholder]: 'MessageSelectMenu placeholder must be a string',
  [DjsErrorCodes.SelectOptionLabel]: 'MessageSelectOption label must be a string',
  [DjsErrorCodes.SelectOptionValue]: 'MessageSelectOption value must be a string',
  [DjsErrorCodes.SelectOptionDescription]: 'MessageSelectOption description must be a string',
  [DjsErrorCodes.InteractionCollectorError]: reason => `Collector received no interactions before ending with reason: ${reason}`,
  [DjsErrorCodes.FileNotFound]: file => `File could not be found: ${file}`,
  [DjsErrorCodes.UserBannerNotFetched]: "You must fetch this user's banner before trying to generate its URL!",
  [DjsErrorCodes.UserNoDMChannel]: 'No DM Channel exists!',

  [DjsErrorCodes.VoiceNotStageChannel]: 'You are only allowed to do this in stage channels.',
  [DjsErrorCodes.VoiceStateNotOwn]: 'You cannot self-deafen/mute/request to speak on VoiceStates that do not belong to the ClientUser.',
  [DjsErrorCodes.VoiceStateInvalidType]: name => `${name} must be a boolean.`,
  [DjsErrorCodes.ReqResourceType]: 'The resource must be a string, Buffer or a valid file stream.',
  [DjsErrorCodes.ImageFormat]: format => `Invalid image format: ${format}`,
  [DjsErrorCodes.ImageSize]: size => `Invalid image size: ${size}`,

  [DjsErrorCodes.MessageBulkDeleteType]: 'The messages must be an Array, Collection, or number.',
  [DjsErrorCodes.MessageNonceType]: 'Message nonce must be an integer or a string.',
  [DjsErrorCodes.MessageContentType]: 'Message content must be a string.',
  [DjsErrorCodes.SplitMaxLen]: 'Chunk exceeds the max length and contains no split characters.',
  [DjsErrorCodes.BanResolveId]: (ban = false) => `Couldn't resolve the user id to ${ban ? 'ban' : 'unban'}.`,
  [DjsErrorCodes.FetchBanResolveId]: "Couldn't resolve the user id to fetch the ban.",
  [DjsErrorCodes.PruneDaysType]: 'Days must be a number',

  [DjsErrorCodes.GuildChannelResolve]: 'Could not resolve channel to a guild channel.',
  [DjsErrorCodes.GuildVoiceChannelResolve]: 'Could not resolve channel to a guild voice channel.',
  [DjsErrorCodes.GuildChannelOrphan]: 'Could not find a parent to this guild channel.',
  [DjsErrorCodes.GuildChannelUnowned]: "The fetched channel does not belong to this manager's guild.",
  [DjsErrorCodes.GuildOwned]: 'Guild is owned by the client.',
  [DjsErrorCodes.GuildMembersTimeout]: "Các thành viên đến không kịp.",
  [DjsErrorCodes.GuildUncachedMe]: 'Người dùng khách hàng với tư cách là thành viên của guild này đã bị xóa.',
  [DjsErrorCodes.ChannelNotCached]: 'Could not find the channel where this message came from in the cache!',
  [DjsErrorCodes.StageChannelResolve]: 'Could not resolve channel to a stage channel.',
  [DjsErrorCodes.GuildScheduledEventResolve]: 'Could not resolve the guild scheduled event.',
  [DjsErrorCodes.FetchOwnerId]: "Couldn't resolve the guild ownerId to fetch the member.",

  [DjsErrorCodes.InvalidType]: (name, expected, an = false) => `Supplied ${name} is not a${an ? 'n' : ''} ${expected}.`,
  [DjsErrorCodes.InvalidElement]: (type, name, elem) => `Supplied ${type} ${name} includes an invalid element: ${elem}`,
  [DjsErrorCodes.MessageThreadParent]: 'The message was not sent in a guild text or news channel',
  [DjsErrorCodes.MessageExistingThread]: 'The message already has a thread',
  [DjsErrorCodes.ThreadInvitableType]: type => `Invitable cannot be edited on ${type}`,

  [DjsErrorCodes.WebhookMessage]: 'The message was not sent by a webhook.',
  [DjsErrorCodes.WebhookTokenUnavailable]: 'This action requires a webhook token, but none is available.',
  [DjsErrorCodes.WebhookURLInvalid]: 'The provided webhook URL is not valid.',
  [DjsErrorCodes.WebhookApplication]: 'This message webhook belongs to an application and cannot be fetched.',
  [DjsErrorCodes.MessageReferenceMissing]: 'The message does not reference another message',

  [DjsErrorCodes.EmojiType]: 'Emoji must be a string or GuildEmoji/ReactionEmoji',
  [DjsErrorCodes.EmojiManaged]: 'Emoji is managed and has no Author.',
  [DjsErrorCodes.MissingManageEmojisAndStickersPermission]: guild => `Client must have Manage Emojis and Stickers permission in guild ${guild} to see emoji authors.`,
  [DjsErrorCodes.NotGuildSticker]: 'Sticker is a standard (non-guild) sticker and has no author.',
  [DjsErrorCodes.ReactionResolveUser]: "Couldn't resolve the user id to remove from the reaction.",

  [DjsErrorCodes.VanityURL]: 'This guild does not have the vanity URL feature enabled.',
  [DjsErrorCodes.InviteResolveCode]: 'Could not resolve the code to fetch the invite.',
  [DjsErrorCodes.InviteNotFound]: 'Could not find the requested invite.',
  [DjsErrorCodes.DeleteGroupDMChannel]: "Bots don't have access to Group DM Channels and cannot delete them",
  [DjsErrorCodes.FetchGroupDMChannel]: "Bots don't have access to Group DM Channels and cannot fetch them",

  [DjsErrorCodes.MemberFetchNonceLength]: 'Độ dài ký tự không được vượt quá 32 ký tự.',
  [DjsErrorCodes.GlobalCommandPermissions]: 'Permissions for global commands may only be fetched or modified by providing a GuildResolvable ' + "or from a guild's application command manager.",
  [DjsErrorCodes.GuildUncachedEntityResolve]: type => `Cannot resolve ${type} from an arbitrary guild, provide an id instead`,
  [DjsErrorCodes.InteractionAlreadyReplied]: 'The reply to this interaction has already been sent or deferred.',
  [DjsErrorCodes.InteractionNotReplied]: 'The reply to this interaction has not been sent or deferred.',
  [DjsErrorCodes.InteractionEphemeralReplied]: 'Ephemeral responses cannot be deleted.',

  [DjsErrorCodes.CommandInteractionOptionNotFound]: name => `Required option "${name}" not found.`,
  [DjsErrorCodes.CommandInteractionOptionType]: (name, type, expected) => `Option "${name}" is of type: ${type}; expected ${expected}.`,
  [DjsErrorCodes.CommandInteractionOptionEmpty]: (name, type) => `Required option "${name}" is of type: ${type}; expected a non-empty value.`,
  [DjsErrorCodes.CommandInteractionOptionNoSubcommand]: 'No subcommand specified for interaction.',
  [DjsErrorCodes.CommandInteractionOptionNoSubcommandGroup]: 'No subcommand group specified for interaction.',
  [DjsErrorCodes.AutocompleteInteractionOptionNoFocusedOption]: 'No focused option for autocomplete interaction.',
  [DjsErrorCodes.ModalSubmitInteractionFieldNotFound]: customId => `Required field with custom id "${customId}" not found.`,
  [DjsErrorCodes.ModalSubmitInteractionFieldType]: (customId, type, expected) => `Field with custom id "${customId}" is of type: ${type}; expected ${expected}.`,
  [DjsErrorCodes.InvalidMissingScopes]: 'At least one valid scope must be provided for the invite',
  [DjsErrorCodes.NotImplemented]: (what, name) => `Method ${what} not implemented on ${name}.`,
  [DjsErrorCodes.SweepFilterReturn]: 'Giá trị trả về của hàm Bộ lọc quét không sai hoặc một Hàm',
};

module.exports = Messages;