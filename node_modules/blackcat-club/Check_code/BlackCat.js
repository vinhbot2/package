const { BlackCat, activity, Collection, AddRoles,  Commands: { EmbedPages, Economy }, Options: { MessageActionRow, Embed, MessageButton }, ButtonStyle } = require("../BlackCat");
const client = new BlackCat(process.env.token, {
  Reply: true // có tag tin nhắn hay là không || true / false
});

/**/
client.on("ready", () => {
  console.log(`${client.user.username}`.red + ` Sẵn sàng hoạt động`.blue);
});
//// 
client.on("messageCreate", async(message) => {
  const { messageAPI } = require("./Handlers/commands");
  messageAPI(client, message, { prefix: "!" });
});

client.on("guildMemberAdd", async(member) => {
      AddRoles(member, {
          Roles: [
               "844061254380421130",
               "853668078516830238", 
               "870660231519170580",
               "850210486208430090"
          ],
      });
});
["setups"].forEach(Blackcat => {
     require(`./Handlers/${Blackcat}`)(client);
});