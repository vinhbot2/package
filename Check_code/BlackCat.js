const { BlackCat, AddRoles } = require("../BlackCat");
const client = new BlackCat(process.env.token || "MTAwMzY4MDYzMTI3MzgyNDMyNg.G6lyHL.B-S2MnZaVyE-eMb6A_nlrOwrh5bsgESwstRAAc", {
  Reply: true // có tag tin nhắn hay là không || true / false
});

/**/
client.on("ready", () => {
  console.log(`${client.user.username}`.red + ` Sẵn sàng hoạt động`.blue);
});
//// 
client.setMongoURL("mongodb+srv://nguyenvinh:blackcat2k3@cluster0.bgyio.mongodb.net/?retryWrites=true&w=majority");
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