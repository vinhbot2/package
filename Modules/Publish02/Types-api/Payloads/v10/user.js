"use strict";
/**
 * Types extracted from https://discord.com/developers/docs/resources/user
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionVisibility = exports.ConnectionService = exports.UserPremiumType = exports.UserFlags = void 0;
/**
 * https://discord.com/developers/docs/resources/user#user-object-user-flags
 */
var UserFlags;
(function (UserFlags) {
    /**
     * Discord Employee
     */
    UserFlags[UserFlags["Staff"] = 1] = "Staff";
    /**
     * Partnered Server Owner
     */
    UserFlags[UserFlags["Partner"] = 2] = "Partner";
    /**
     * HypeSquad Events Member
     */
    UserFlags[UserFlags["Hypesquad"] = 4] = "Hypesquad";
    /**
     * Bug Hunter Level 1
     */
    UserFlags[UserFlags["BugHunterLevel1"] = 8] = "BugHunterLevel1";
    /**
     * House Bravery Member
     */
    UserFlags[UserFlags["HypeSquadOnlineHouse1"] = 64] = "HypeSquadOnlineHouse1";
    /**
     * House Brilliance Member
     */
    UserFlags[UserFlags["HypeSquadOnlineHouse2"] = 128] = "HypeSquadOnlineHouse2";
    /**
     * House Balance Member
     */
    UserFlags[UserFlags["HypeSquadOnlineHouse3"] = 256] = "HypeSquadOnlineHouse3";
    /**
     * Early Nitro Supporter
     */
    UserFlags[UserFlags["PremiumEarlySupporter"] = 512] = "PremiumEarlySupporter";
    /**
     * User is a [team](https://discord.com/developers/docs/topics/teams)
     */
    UserFlags[UserFlags["TeamPseudoUser"] = 1024] = "TeamPseudoUser";
    /**
     * Bug Hunter Level 2
     */
    UserFlags[UserFlags["BugHunterLevel2"] = 16384] = "BugHunterLevel2";
    /**
     * Verified Bot
     */
    UserFlags[UserFlags["VerifiedBot"] = 65536] = "VerifiedBot";
    /**
     * Early Verified Bot Developer
     */
    UserFlags[UserFlags["VerifiedDeveloper"] = 131072] = "VerifiedDeveloper";
    /**
     * Discord Certified Moderator
     */
    UserFlags[UserFlags["CertifiedModerator"] = 262144] = "CertifiedModerator";
    /**
     * Bot uses only [HTTP interactions](https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction) and is shown in the online member list
     */
    UserFlags[UserFlags["BotHTTPInteractions"] = 524288] = "BotHTTPInteractions";
    /**
     * User has been identified as spammer
     *
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     */
    UserFlags[UserFlags["Spammer"] = 1048576] = "Spammer";
    /**
     * User's account has been quarantined based on recent activity
     *
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     */
    UserFlags[UserFlags["Quarantined"] = Math.pow(2, 44)] = "Quarantined";
})(UserFlags = exports.UserFlags || (exports.UserFlags = {}));
/**
 * https://discord.com/developers/docs/resources/user#user-object-premium-types
 */
var UserPremiumType;
(function (UserPremiumType) {
    UserPremiumType[UserPremiumType["None"] = 0] = "None";
    UserPremiumType[UserPremiumType["NitroClassic"] = 1] = "NitroClassic";
    UserPremiumType[UserPremiumType["Nitro"] = 2] = "Nitro";
})(UserPremiumType = exports.UserPremiumType || (exports.UserPremiumType = {}));
var ConnectionService;
(function (ConnectionService) {
    ConnectionService["BattleNet"] = "battlenet";
    ConnectionService["EpicGames"] = "epicgames";
    ConnectionService["Facebook"] = "facebook";
    ConnectionService["GitHub"] = "github";
    ConnectionService["LeagueOfLegends"] = "leagueoflegends";
    ConnectionService["PlayStationNetwork"] = "playstation";
    ConnectionService["Reddit"] = "reddit";
    ConnectionService["SamsungGalaxy"] = "samsunggalaxy";
    ConnectionService["Spotify"] = "spotify";
    ConnectionService["Skype"] = "skype";
    ConnectionService["Steam"] = "steam";
    ConnectionService["Twitch"] = "twitch";
    ConnectionService["Twitter"] = "twitter";
    ConnectionService["Xbox"] = "xbox";
    ConnectionService["YouTube"] = "youtube";
})(ConnectionService = exports.ConnectionService || (exports.ConnectionService = {}));
var ConnectionVisibility;
(function (ConnectionVisibility) {
    /**
     * Invisible to everyone except the user themselves
     */
    ConnectionVisibility[ConnectionVisibility["None"] = 0] = "None";
    /**
     * Visible to everyone
     */
    ConnectionVisibility[ConnectionVisibility["Everyone"] = 1] = "Everyone";
})(ConnectionVisibility = exports.ConnectionVisibility || (exports.ConnectionVisibility = {}));
//# sourceMappingURL=user.js.map