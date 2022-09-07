# <p align="center">BlackCat-Club - Ranking</p>

<p align="center">
	<a href="https://www.facebook.com/BlackCat.2k3">
	<img src="https://statics.voz.tech/data/avatars/o/1093/1093136.jpg?1584167722" width = "200" alt="TNT">
	</a>
</p>

```js
/* xp Example */
const { Commands: { ranking }} = require("blackcat-club");
// Returns the xp needed to reach level 30.
var xpRequired = ranking.xpFor(30);
console.log(xpRequired); // Output: 90000
```

# Installing
First thing, we put the module in the project:
```js
const { Commands: { ranking }} = require("blackcat-club");
```

# <p align="center">Examples</p>

+ `userID = message.user.id`
+ `GuildID = message.guild.id`
+ `Amount = args`
#
**createUser**

Creates an entry in database for that user if it doesnt exist.
```js
Levels.createUser(<UserID - String>, <GuildID - String>);
```
- Output:
```
Promise<Object>
```
**deleteUser**

If the entry exists, it deletes it from database.
```js
Levels.deleteUser(<UserID - String>, <GuildID - String>);
```
- Output:
```
Promise<Object>
```
**appendXp**

It adds a specified amount of xp to the current amount of xp for that user, in that guild. It re-calculates the level. It creates a new user with that amount of xp, if there is no entry for that user. 
```js
Levels.appendXp(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean>
```
**appendLevel**

It adds a specified amount of levels to current amount, re-calculates and sets the xp reqired to reach the new amount of levels. 
```js
Levels.appendLevel(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean/Object>
```
**setXp**

It sets the xp to a specified amount and re-calculates the level.
```js
Levels.setXp(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean/Object>
```
**setLevel**

Calculates the xp required to reach a specified level and updates it.
```js
Levels.setLevel(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean/Object>
```
**fetch** (**Updated recently!**)

Retrives selected entry from the database, if it exists.
```js
Levels.fetch(<UserID - String>, <GuildID - String>, <FetchPosition - Boolean>);
```
- Output:
```
Promise<Object>
```
**subtractXp**

It removes a specified amount of xp to the current amount of xp for that user, in that guild. It re-calculates the level.
```js
Levels.subtractXp(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean/Object>
```
**subtractLevel**

It removes a specified amount of levels to current amount, re-calculates and sets the xp reqired to reach the new amount of levels. 
```js
Levels.subtractLevel(<UserID - String>, <GuildID - String>, <Amount - Number>);
```
- Output:
```
Promise<Boolean/Object>
```
**fetchLeaderboard**

It gets a specified amount of entries from the database, ordered from higgest to lowest within the specified limit of entries.
```js
Levels.fetchLeaderboard(<GuildID - String>, <Limit - Integer>);
```
- Output:
```
Promise<Array [Objects]>
```
**computeLeaderboard** (**Updated recently!**)

It returns a new array of object that include level, xp, guild id, user id, leaderboard position, username and discriminator.
```js
Levels.computeLeaderboard(<Client - Discord.js Client>, <Leaderboard - fetchLeaderboard output>, <fetchUsers - boolean, disabled by default>);
```
- Output:
```
Promise<Array [Objects]>
```
**xpFor**

It returns a number that indicates amount of xp required to reach a level based on the input.
```js
Levels.xpFor(<TargetLevel - Integer>);
```
- Output:
```
Integer
```

# <p align="center">Some examples</p>

# Examples
+ *Examples assume that you have setted up the module as presented in 'Setting Up' section.*
+ *Following examples assume that your `Discord.Client` is called `client`.*
+ *Following examples assume that your `client.on("message", message` is called `message`.*
+ *Following example contains isolated code which you need to integrate in your own command handler.*
+ *Following example assumes that you are able to write asynchronous code (use `await`).*

- **Allocating Random XP For Each Message Sent**
```js
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;
  const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
  const hasLeveledUp = await ranking.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
  // you can also use the money command when you upgrade
  if (hasLeveledUp) {
    const user = await ranking.fetch(message.author.id, message.guild.id);
    message.reply({ content: `${message.author}, Congratulations! You have leveled up **${user.level}**. :tada:` });
  }
});
```

- **Rank Order**
```js
const target = message.mentions.users.first() || message.author; // Grab the target.
const user = await ranking.fetch(target.id, message.guild.id); // Select target from database.
if (!user) return message.channel.send("Looks like this user hasn't earned any xp so far."); // If there is no such user in the database, we will send a general message.

message.reply(`> **${target.tag}** is now level ${user.level}.`); // We show class.
```

- **Leaderboard command**
```js
const rawLeaderboard = await ranking.fetchLeaderboard(message.guild.id, 10); // We take the top 10 users with the most xp in the current server.
if (rawLeaderboard.length < 1) return reply("No one in the leaderboard yet.");
const leaderboard = await ranking.computeLeaderboard(client, rawLeaderboard, true); // Chúng tôi xử lý bảng thành tích.
const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`); // We map the outputs.

message.reply(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
```

- **Canvacord integration**
![Demo](https://raw.githubusercontent.com/VinhBot/BlackCat-Package/main/Preview/rank.jpg)
```js
const canvacord = require("canvacord");
const img = "https://cdn.discordapp.com/attachments/866970321977737217/867019317065547776/FB_IMG_1626186229672.jpg";
const { files_name, Commands: { ranking }, EmbedBuilder, AttachmentBuilder } = require("blackcat-club");

        const Levels = ranking;
        const target = message.mentions.users.first() || message.author; 
        const user = await Levels.fetch(target.id, message.guild.id);
        if (!user) return message.reply({ content: `Không có Điểm rank`}); 
        const rankcmds = ``;
        const neededXp = Levels.xpFor(parseInt(user.level) + 1 )
        const rank = new canvacord.Rank()
           .setAvatar(target.displayAvatarURL({ dinamyc: false, format: 'png' }))
           .setBackground("IMAGE", img)
           .setRank(1, "RANK", false)
           .setLevel(user.level)
           .setCurrentXP(user.xp)
           .setRequiredXP(neededXp)
           .setStatus("online")
           .setProgressBar("#E4B400", "COLOR")
           .setUsername(target.username)
           .setDiscriminator(target.discriminator);
       rank.build()
          .then(data => {
              const attachment = new AttachmentBuilder(data, { name: "RankCard.png" });
              message.reply({ files: [attachment] });
      });
```
# <p align="center">It's time to get creative..</p>