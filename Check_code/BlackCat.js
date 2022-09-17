const { BlackCat, AddRoles } = require("../BlackCat");
const client = new BlackCat(process.env.token || "", {
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

["setups"].forEach(Blackcat => {
     require(`./Handlers/${Blackcat}`)(client);
});
