# <p align="center">BlackCat-Club - Ranking</p>

<p align="center">
	<a href="https://www.facebook.com/BlackCat.2k3">
	<img src="https://statics.voz.tech/data/avatars/o/1093/1093136.jpg?1584167722" width = "200" alt="TNT">
	</a>
</p>

```js
/* xp Ví dụ */
const { Commands: { ranking }} = require("blackcat-club");
// Trả về xp cần thiết để đạt cấp 30.
var xpRequired = ranking.xpFor(30);
console.log(xpRequired); // Đầu ra: 90000
```

# Đang cài đặt
Điều đầu tiên, chúng tôi đưa mô-đun vào dự án:
```js
const { Commands: { ranking }} = require("blackcat-club");
```

# <p align="center">Các ví dụ</p>

+ `userID = message.user.id`
+ `GuildID = message.guild.id`
+ `Amount = args`
  
# Phương pháp
*tạo người dùng*
*Tạo một mục nhập trong cơ sở dữ liệu cho người dùng đó nếu nó không tồn tại.
```js
ranking.createUser(<UserID - String>, <GuildID - String>);
```
- Đầu ra:
```
Promise<Object>
```
**xóa người dùng**

Nếu mục nhập tồn tại, nó sẽ xóa nó khỏi cơ sở dữ liệu.
```js
ranking.deleteUser(<UserID - String>, <GuildID - String>);
```
- Đầu ra:
```
Promise<Object>
```
**xóa Guild**

Nếu mục nhập tồn tại, nó sẽ xóa nó khỏi cơ sở dữ liệu.
```js
ranking.deleteGuild(<GuildID - String>);
```
- Đầu ra:
```
Promise<Object>
```
**nối thêm Xp**

Nó thêm một lượng xp cụ thể vào lượng xp hiện tại cho người dùng đó,
trong hội đó. Nó tính toán lại mức độ.
Nó tạo ra một người dùng mới với lượng xp đó, nếu không có mục nhập cho người dùng đó.
```js
ranking.appendXp(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Đầu ra:
```
Promise<Boolean>
```
**nối cấp độ**

Nó thêm một lượng cấp độ cụ thể vào số tiền hiện tại, tính toán lại và đặt xp yêu cầu để đạt được số lượng cấp độ mới. 
```js
ranking.appendLevel(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Đầu ra:
```
Promise<Boolean/Object>
```
**đặt Xp**

Nó đặt xp thành một số tiền được chỉ định và tính toán lại mức.
```js
ranking.setXp(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Đầu ra:
```
Promise<Boolean/Object>
```
**thiết lập cấp độ**

Tính toán xp cần thiết để đạt đến một cấp độ cụ thể và cập nhật nó.
```js
ranking.setLevel(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Đầu ra:
```
Promise<Boolean/Object>
```
**tìm về** (**Đã cập nhật gần đây!**)

Truy xuất mục nhập đã chọn từ cơ sở dữ liệu, nếu nó tồn tại.
```js
ranking.fetch(<UserID - String>, <GuildID - String>, <FetchPosition - Boolean>);
```
- Đầu ra:
```
Promise<Object>
```
**trừ Xp**

Nó loại bỏ một lượng xp cụ thể thành số lượng xp hiện tại cho người dùng đó, trong guild đó. Nó tính toán lại mức độ.
```js
ranking.subtractXp(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Đầu ra:
```
Promise<Boolean/Object>
```
**trừ cấp độ**

Nó loại bỏ một lượng cấp độ cụ thể thành số tiền hiện tại, tính toán lại và đặt xp yêu cầu để đạt được số lượng cấp độ mới. 
```js
ranking.subtractLevel(<UserID - String>, <GuildID - String>, <Amount - Number>);
```
- Đầu ra:
```
Promise<Boolean/Object>
```
**tìm nạp Bảng xếp hạng**

Nó nhận được một lượng mục nhập cụ thể từ cơ sở dữ liệu, được sắp xếp từ cao nhất đến thấp nhất trong giới hạn mục nhập được chỉ định.
```js
Levels.fetchLeaderboard(<GuildID - String>, <Limit - Integer>);
```
- Đầu ra:
```
Promise<Array [Objects]>
```
**tính toán Bảng xếp hạng** (**Đã cập nhật gần đây!**)

Nó trả về một mảng đối tượng mới bao gồm cấp độ, xp, id guild, id người dùng, vị trí bảng thành tích, tên người dùng và dấu phân biệt.
```js
ranking.computeLeaderboard(<Client - Discord.js Client>, <Leaderboard - fetchLeaderboard output>, <fetchUsers - boolean, disabled by default>);
```
- Đầu ra:
```
Promise<Array [Objects]>
```
**xp Đối với**

Nó trả về một số cho biết số lượng xp cần thiết để đạt được một cấp độ dựa trên đầu vào.
```js
ranking.xpFor(<TargetLevel - Integer>);
```
- Đầu ra:
```
Integer
```
# <p align="center">Một số ví dụ</p>
# Các ví dụ:
+ *Ví dụ giả sử rằng bạn đã thiết lập mô-đun như được trình bày trong phần 'Thiết lập'.*
+ *Các ví dụ sau giả sử rằng `Discord.Client` của bạn được gọi là `client`.*
+ *Các ví dụ sau giả sử rằng `client.on("messageCreate", message` của bạn được gọi là `message`.*
+ *Ví dụ sau chứa mã riêng biệt mà bạn cần tích hợp trong trình xử lý lệnh của riêng mình.*
+ *Ví dụ sau giả định rằng bạn có thể viết mã không đồng bộ (sử dụng `await`).*

- **Phân bổ XP ngẫu nhiên cho mỗi tin nhắn được gửi**
```js
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;
  const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Tối thiểu 1, Tối đa 30
  const hasLeveledUp = await ranking.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
  if (hasLeveledUp) {
    const user = await ranking.fetch(message.author.id, message.guild.id);
    message.channel.send({ content: `${message.author}, Xin chúc mừng! Bạn đã lên cấp **${user.level}**. :tada:` });
  }
});
```

- **Lệnh xếp hạng**
```js
const target = message.mentions.users.first() || message.author; // Nắm lấy mục tiêu.
const user = await ranking.fetch(target.id, message.guild.id); // Chọn mục tiêu từ cơ sở dữ liệu.
if (!user) return message.channel.send("Có vẻ như người dùng này đã không kiếm được bất kỳ xp nào cho đến nay."); // Nếu không có người dùng như vậy trong cơ sở dữ liệu, chúng tôi sẽ gửi một tin nhắn nói chung.

message.reply(`> **${target.tag}** hiện là cấp ${user.level}.`); // Chúng tôi thể hiện đẳng cấp.
```

- **Lệnh bảng xếp hạng**
```js
const rawLeaderboard = await ranking.fetchLeaderboard(message.guild.id, 10); // Chúng tôi lấy 10 người dùng hàng đầu có nhiều xp nhất trong máy chủ hiện tại.
if (rawLeaderboard.length < 1) return reply("Chưa có ai trong bảng thành tích.");
const leaderboard = await ranking.computeLeaderboard(client, rawLeaderboard, true); // Chúng tôi xử lý bảng thành tích.
const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`); // Chúng tôi lập bản đồ kết quả đầu ra.

message.reply(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
```

- **Tích hợp Canvacord**
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
# <p align="center">Đã đến lúc bạn sáng tạo..</p>