const { BlackCat, Collection,  Commands: { EmbedPages, Economy }, Options: { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle }} = require("../../BlackCat");
async function messageAPI(client, message, config = {}) {
  if (message.author.bot || !message.inGuild()) return;
	if (!message.content.startsWith(config.prefix)) return;
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift();
  
  if(command === 'b'){
    let Embed1 = new EmbedBuilder().setDescription("Page 1").setColor("Random")
    let Embed2 = new EmbedBuilder().setDescription("Page 2").setColor("Random")
    let Embed3 = new EmbedBuilder().setDescription("Page 2").setColor("Random")
    let embeds = [];
    embeds.push(Embed1, Embed2, Embed3);
    EmbedPages(message, embeds, {
    // but1: tương ứng với các emoji tùy chỉnh, để trống để dùng emoji mặc định
    but1: "", // Đầu tiên
    but2: "", // Trước
    but3: "", // Xoá bỏ
    but4: "", // Tiếp theo
    but5: "", // cuối cùng
    butColor: "", // màu của các nút chuyển động
    butColor: "" // màu của nút xoá
    });
  };
};
module.exports = {messageAPI};