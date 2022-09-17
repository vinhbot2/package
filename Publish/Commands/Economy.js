const { findUser, getInventory } = require("../Functions/functionsEconomyOptions");
const Hang_Ton_kho = require("../Schema/inventory");
const TienTe = require("../Schema/currency");
class Blackcat_Money {
  // Việt Nam
  vietnam(Con_so) {
     var Dinh_dang = new Intl.NumberFormat('vi-VN', {
	       style: 'currency',
	       currency: 'VND',
      });
      return Dinh_dang.format(Con_so);
  };
  // Mĩ 
  us(Con_so) {
      var Dinh_dang = new Intl.NumberFormat('US', {
	      style: 'currency',
	      currency: 'USD',
      });
      return Dinh_dang.format(Con_so);
  };
  // Japan 
  japanese(Con_so) {
      var Dinh_dang = new Intl.NumberFormat('JP', {
	      style: 'currency',
	      currency: 'JPY',
     });
     return Dinh_dang.format(Con_so);
  };
  // hàn quốc
  korean(Con_so) {
     var Dinh_dang = new Intl.NumberFormat('ko-KR', {
	      style: 'currency',
	      currency: 'KRW',
     });
     return Dinh_dang.format(Con_so);
  };
  // Nga 
  russian(Con_so) {
     var Dinh_dang = new Intl.NumberFormat('ru-RU', {
	      style: 'currency',
	      currency: 'RUB',
     });
     return Dinh_dang.format(Con_so);
  };
  // đức
  german(Con_so) {
     var Dinh_dang = new Intl.NumberFormat('de-DE', {
	     style: 'currency',
	     currency: 'EUR',
     });
     return Dinh_dang.format(Con_so);
  }; 
  /// anh 
  english(Con_so) {
    var Dinh_dang = new Intl.NumberFormat('en-GB', {
 	     style: 'currency',
	     currency: 'GBP',
     });
    return Dinh_dang.format(Con_so);
  };
  addItem(Cai_Dat) {
    if (!Cai_Dat.inventory) return { error: true, type: "No-Inventory" };
    if (!Cai_Dat.inventory.name) return { error: true, type: "No-Inventory-Name" };
    if (!Cai_Dat.inventory.price) return { error: true, type: "No-Inventory-Price" };
    if (!parseInt(Cai_Dat.inventory.price)) return { error: true, type: "Invalid-Inventory-Price" };
    const Mat_hang = {
      name: String(Cai_Dat.inventory.name) || "Air",
      price: parseInt(Cai_Dat.inventory.price) || 0,
      description: String(Cai_Dat.inventory.description) || "Không có mô tả",
    };
    if (typeof Cai_Dat.guild === "string") Cai_Dat.guild = { id: Cai_Dat.guild };
    if (!Cai_Dat.guild) Cai_Dat.guild = { id: null };
    Hang_Ton_kho.findOneAndUpdate({ guildID: Cai_Dat.guild.id || null },{$push: { inventory: Mat_hang }},{ upsert: true, useFindAndModify: false }, (e, d) => { 
      if(e) return console.log(e);
    });
    return { error: false, item: Mat_hang };
  }
  
  async removeItem(Cai_Dat) {
    let Data_hang_ton_kho = await getInventory(Cai_Dat);
    let Dieu_huong = parseInt(Cai_Dat.item);
    if (!Dieu_huong) return { error: true, type: "Invalid-Item-Number" };
    Dieu_huong = Dieu_huong - 1;
    if (!Data_hang_ton_kho.inventory[Dieu_huong]) return { error: true, type: "Unknown-Item" };
    const Da_xoa_data = Data_hang_ton_kho.inventory[Dieu_huong];
    Data_hang_ton_kho.inventory.splice(Dieu_huong, 1);
    Data_hang_ton_kho.save();
    return { error: false, inventory: Da_xoa_data };
  }
  
  async setItems(Cai_Dat) {
    if (!Cai_Dat.shop) return { error: true, type: "No-Shop" };
    if (!Array.isArray(Cai_Dat.shop)) return { error: true, type: "Invalid-Shop" };
    for (const So_lieu of Cai_Dat.shop) {
      if (!So_lieu.name)
        return { error: true, type: "Invalid-Shop-name" };
      if (!So_lieu.price)
        return { error: true, type: "Invalid-Shop-price" };
      if (!So_lieu.description) So_lieu.description = "Không có mô tả.";
    }
    Hang_Ton_kho.findOneAndUpdate({ guildID: Cai_Dat.guild.id || null },{$set: {inventory: Cai_Dat.shop}},{ upsert: true, useFindAndModify: false}, (e, d) => { 
      if(e) return console.log(e);
    });
    return { error: false, type: "success" };
  }
  
  async removeUserItem(Cai_Dat) {
    let Du_lieu = await findUser(Cai_Dat, null, null, "removeUserItem");
    let Dieu_huong = parseInt(Cai_Dat.item);
    if (!Dieu_huong) return { error: true, type: "Invalid-Item-Number" };
    Dieu_huong = Dieu_huong - 1;
    if (!Du_lieu.inventory[Dieu_huong]) return { error: true, type: "Unknown-Item" };
    let Lam_xong = false,
      Da_xoa_data = {};
    for (let i in Du_lieu.inventory) {
      if (Du_lieu.inventory[i] === Du_lieu.inventory[Dieu_huong]) {
        if (Du_lieu.inventory[i].amount > 1) {
          Du_lieu.inventory[i].amount--;
          Da_xoa_data = Du_lieu.inventory[i];
          Lam_xong = true;
        } else if (Du_lieu.inventory[i].amount === 1) {
          Da_xoa_data = Du_lieu.inventory[i];
          Da_xoa_data.amount = 0;
          Du_lieu.inventory.splice(i, 1);
          Lam_xong = true;
        }
      }
    }
    if (Lam_xong == false) return { error: true, type: "Invalid-Item-Number" };
    TienTe.findOneAndUpdate({ guildID: Cai_Dat.guild.id || null, userID: Cai_Dat.user.id || null },{$set: {inventory: Du_lieu.inventory}},{ upsert: true, useFindAndModify: false }, (e, d) => { if (e) return console.log(e)});
    return { error: false, inventory: Da_xoa_data, rawData: Du_lieu };
  };
  
  async buy(Cai_Dat) {
    return await khoi_tao_mua_hang(Cai_Dat);
  };
  async addUserItem(Cai_Dat) {
    return await khoi_tao_mua_hang(Cai_Dat);
  };
};
async function khoi_tao_mua_hang(Cai_Dat) {
  let Data_hang_ton_kho = await getInventory(Cai_Dat);
  let Du_lieu = await findUser(Cai_Dat, null, null, "buy");
  if (!Cai_Dat.guild) Cai_Dat.guild = { id: null };
  let Dieu_huong = parseInt(Cai_Dat.item);
  if (!Dieu_huong) return { error: true, type: "No-Item" };
  Dieu_huong = Dieu_huong - 1;
  if (!Data_hang_ton_kho.inventory[Dieu_huong]) return { error: true, type: "Invalid-Item" };
  if (Du_lieu.wallet < Data_hang_ton_kho.inventory[Dieu_huong].price) return { error: true, type: "low-money" };
  Du_lieu.wallet -= Data_hang_ton_kho.inventory[Dieu_huong].price;
  let Lam_xong = false;
  let Lam_mat_hang = true;
  for (let j in Du_lieu.inventory) {
    if (Data_hang_ton_kho.inventory[Dieu_huong].name === Du_lieu.inventory[j].name)
      Lam_mat_hang = false;
  }
  if (Lam_mat_hang == false) {
    for (let j in Du_lieu.inventory) {
      if (Data_hang_ton_kho.inventory[Dieu_huong].name === Du_lieu.inventory[j].name) {
        Du_lieu.inventory[j].amount++;
        Lam_xong = true;
      }
    }
  }
  if (Lam_xong == false) {
    Du_lieu.inventory.push({ name: Data_hang_ton_kho.inventory[Dieu_huong].name, amount: 1 });
  }
  TienTe.findOneAndUpdate({ guildID: Cai_Dat.guild.id || null, userID: Cai_Dat.user.id || null },{$set: {inventory: Du_lieu.inventory, wallet: Du_lieu.wallet }}, { upsert: true, useFindAndModify: false }, (e, d) => { if (e) return console.error(e) });
  return { error: false, type: "success", inventory: Data_hang_ton_kho.inventory[Dieu_huong] };
}
Object.assign(Blackcat_Money.prototype, require("../Functions/functionsEconomyOptions"));
module.exports = Blackcat_Money;