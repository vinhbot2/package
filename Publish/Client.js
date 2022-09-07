/*-------------------------------------
# Author: Nguyễn Văn Vinh
--------------------------------------*/
'use strict';
const { Client: Xay_dung_vi_tri_khach_hang, Partials } = require("../Modules/MainEvents");
const { GatewayIntentBits } = require("../Modules/Publish02/api");
const Du_lieu = require("mongoose");
const colors = require("colors");
/*
colors.setTheme({
  error: "red",
  success: "green"  
});
*/
const AddRoles = (member, role = {}) => {
  if(!member.guild) return;
  let roles = role.Roles;
  for(let i = 0; i < roles.length; i++ )
  member.roles.add(roles[i]);
  /*-------------------------
  # Tự động thêm role khi có thành viên mới vào máy chủ
  # Automatically add role when new members join the server
  # Thí dụ: 
  
  client.on("guildMemberAdd", async(member) => {
      AddRoles(member, {
          Roles: [
               "Roles ID"
          ],
      });
  });
  --------------------------*/
};

class BlackCat extends Xay_dung_vi_tri_khach_hang {
  constructor(token, login, Phanhoitinnhan = {}) {
    super({
      messageCacheLifetime: 60,
      fetchAllMembers: false,
      messageCacheMaxSize: 10,
      restTimeOffset: 0,
      restWsBridgetimeout: 100,
      shards: "auto",
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: Phanhoitinnhan.Reply,
      },
      partials: [ Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember ],
      intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent ],
    });
    this.login(token);
  };
  ThongtinBLC() {
     const { version, author, name } = require("./package.json");
     const Bang_So_lieu = require("./Modules/Functions/asciilog");
     var Bang_con = new Bang_So_lieu("BlackCat-Club");
     Bang_con.setHeading("item name", "Information");
     Bang_con.addRow("author:", `${author}`)
     Bang_con.addRow("name:", `${name}`)
     Bang_con.addRow("version:", `v${version}`)
     return Bang_con.toString();
  };
  NewUpdate(Dinh_dang = true) {
    if (Dinh_dang) kiem_tra_update();
    async function kiem_tra_update() {
      if (!require("node-fetch")) return;
      const Du_lieu_goi = await require("node-fetch")(`https://registry.npmjs.com/blackcat-club`).then((van_ban) => van_ban.json());
      if (require("../package.json").version !== Du_lieu_goi["dist-tags"].latest) {
        console.log("\n\n");
        console.log("\x1b[32m" + "---------------------------------------");
        console.log("\x1b[32m" + "|          @blackcat-club      - [] X |");
        console.log("\x1b[32m" + "---------------------------------------");
        console.log("\x1b[33m" + `|         Mô-đun đã lỗi thời!\x1b[33m         |`);
        console.log("\x1b[35m" + "|       Phiên bản mới đã có sẵn!      |");
        console.log("\x1b[34m" + `|          ${require("../package.json").version} --> ${Du_lieu_goi["dist-tags"].latest}           |`);
        console.log("\x1b[36m" + '|  Chạy "npm i blackcat-club@latest"  |');
        console.log("\x1b[36m" + "|            để cập nhật!             |");
        console.log("\x1b[37m" + `|   Xem lại thay đổi trong hướng dẫn  |`);
        console.log("\x1b[32m" + "--------------------------------------\x1b[37m");
        console.log("\n\n");
       };
    };
  };
  setMongoURL(Mat_Khau, Dang_nhap = true) {
    if (!Mat_Khau.startsWith("mongodb"))
       console.log("MongoURL không hợp lệ");
    kiem_tra_ket_noi(Mat_Khau, Dang_nhap);
    function kiem_tra_ket_noi(Cung_co, Dang_nhap = true) {
        let Ket_noi = true;
        Du_lieu.connect(Cung_co, {
           useNewUrlParser: true,
           useUnifiedTopology: true,
        }).catch((e) => {
          Ket_noi = false;
          throw new TypeError(`error: ${e}`);
        }).then(() => {
          if (Ket_noi && Dang_nhap);
        });
    process.mongoURL = Mat_Khau;
   };
  };
};

module.exports.BlackCat = BlackCat;
// auto commands
module.exports.AddRoles = AddRoles;
// Set Language
module.exports.Language = require("./Language/Language");
// Game Commands
module.exports.Game = {
  ConnectFour: require("./Game/connect4"),
  SnakeGame: require("./Game/snake"),
};
// Function Commands
module.exports.Commands = {
    EmbedPages: require("./Commands/EmbedPages"),
    Economy: require("./Commands/Economy"),
    ranking: require("./Commands/Ranking"),
};
// asscii-table
module.exports.ascii = require("./Functions/functionsAsciilog");
// path 
module.exports.files_name = require("path");
/*-------------------------
cái này dành cho developer
*/
module.exports.Options = require("./Commands/MessageOptions");
/*--------------------------*/