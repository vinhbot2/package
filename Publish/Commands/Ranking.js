'use strict'; 
const Cap_bac = require("../Schema/levels.js");
class ranking {
  static async fetchLeaderboard(ID_may_chu, Dat_gioi_han) {
    if (!ID_may_chu) throw new TypeError("Id guild không được cung cấp.");
    if (!Dat_gioi_han) throw new TypeError("Giới hạn không được cung cấp.");
    const Thanh_vien = await Cap_bac.find({ guildID: ID_may_chu }).sort([['xp', 'descending']]).limit(Dat_gioi_han).exec();
    return Thanh_vien;
  };
  static async createUser(ID_thanh_vien, ID_may_chu) {
    if (!ID_thanh_vien) throw new TypeError("Một id người dùng không được cung cấp.");
    if (!ID_may_chu) throw new TypeError("Id guild không được cung cấp.");
    const La_nguoi_dung = await Cap_bac.findOne({ userID: ID_thanh_vien, guildID: ID_may_chu });
    if (La_nguoi_dung) return false;
    const Nguoi_dung_moi = new Cap_bac({ userID: ID_thanh_vien, guildID: ID_may_chu });
    await Nguoi_dung_moi.save().catch(e => console.log(`Không tạo được người dùng: ${e}`));
    return Nguoi_dung_moi;
  };
  static async deleteUser(ID_thanh_vien, ID_may_chu) {
    if (!ID_thanh_vien) throw new TypeError("Một id người dùng không được cung cấp.");
    if (!ID_may_chu) throw new TypeError("Id guild không được cung cấp.");
    const Nguoi_dung = await Cap_bac.findOne({ userID: ID_thanh_vien, guildID: ID_may_chu });
    if (!Nguoi_dung) return false;
    await Cap_bac.findOneAndDelete({ userID: ID_thanh_vien, guildID: ID_may_chu }).catch(e => console.log(`Không xóa được người dùng: ${e}`));
    return Nguoi_dung;
  };
  static async appendXp(ID_thanh_vien, ID_may_chu, xp) {
    if (!ID_thanh_vien) throw new TypeError("Một id người dùng không được cung cấp.");
    if (!ID_may_chu) throw new TypeError("Id guild không được cung cấp.");
    if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("Một lượng xp không được cung cấp / không hợp lệ.");
    const Nguoi_dung = await Cap_bac.findOne({ userID: ID_thanh_vien, guildID: ID_may_chu });
    if (!Nguoi_dung) {
      const Nguoi_dung_moi = new Cap_bac({ userID: ID_thanh_vien, guildID: ID_may_chu, xp: xp, level: Math.floor(0.1 * Math.sqrt(xp))});
      await Nguoi_dung_moi.save().catch(e => console.log(`Không lưu được người dùng mới.`));
      return (Math.floor(0.1 * Math.sqrt(xp)) > 0);
    };
    Nguoi_dung.xp += parseInt(xp, 10);
    Nguoi_dung.level = Math.floor(0.1 * Math.sqrt(Nguoi_dung.xp));
    Nguoi_dung.lastUpdated = new Date();
    await Nguoi_dung.save().catch(e => console.log(`Không nối được xp: ${e}`) );
    return (Math.floor(0.1 * Math.sqrt(Nguoi_dung.xp -= xp)) < Nguoi_dung.level);
  };
  static async appendLevel(ID_thanh_vien, ID_may_chu, Cap_do) {
    if (!ID_thanh_vien) throw new TypeError("Một id người dùng không được cung cấp.");
    if (!ID_may_chu) throw new TypeError("Id guild không được cung cấp.");
    if (!Cap_do) throw new TypeError("Một lượng cấp độ không được cung cấp.");
    const Nguoi_dung = await Cap_bac.findOne({ userID: ID_thanh_vien, guildID: ID_may_chu });
    if (!Nguoi_dung) return false;
    Nguoi_dung.level += parseInt(Cap_do, 10);
    Nguoi_dung.xp = Nguoi_dung.level * Nguoi_dung.level * 100;
    Nguoi_dung.lastUpdated = new Date();
    Nguoi_dung.save().catch(e => console.log(`Không nối được cấp độ: ${e}`) );
    return Nguoi_dung;
  };
  static async setXp(ID_thanh_vien, ID_may_chu, xp) {
    if (!ID_thanh_vien) throw new TypeError("Một id người dùng không được cung cấp.");
    if (!ID_may_chu) throw new TypeError("Id guild không được cung cấp.");
    if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("Một lượng xp không được cung cấp / không hợp lệ.");
    const Nguoi_dung = await Cap_bac.findOne({ userID: ID_thanh_vien, guildID: ID_may_chu });
    if (!Nguoi_dung) return false;
    Nguoi_dung.xp = xp;
    Nguoi_dung.level = Math.floor(0.1 * Math.sqrt(Nguoi_dung.xp));
    Nguoi_dung.lastUpdated = new Date();
    Nguoi_dung.save().catch(e => console.log(`Không đặt được xp: ${e}`) );
    return Nguoi_dung;
  };
  static async setLevel(ID_thanh_vien, ID_may_chu, Cap_do_) {
    if (!ID_thanh_vien) throw new TypeError("Một id người dùng không được cung cấp.");
    if (!ID_may_chu) throw new TypeError("Id guild không được cung cấp.");
    if (!Cap_do_) throw new TypeError("Một cấp độ không được cung cấp.");
    const Nguoi_dung = await Cap_bac.findOne({ userID: ID_thanh_vien, guildID: ID_may_chu });
    if (!Nguoi_dung) return false;
    Nguoi_dung.level = Cap_do_;
    Nguoi_dung.xp = Cap_do_ * Cap_do_ * 100;
    Nguoi_dung.lastUpdated = new Date();
    Nguoi_dung.save().catch(e => console.log(`Không đặt được cấp độ: ${e}`) );
    return Nguoi_dung;
  };
  static async fetch(ID_thanh_vien, ID_may_chu, Tim_nap_vi_tri = false) {
    if (!ID_thanh_vien) throw new TypeError("Một id người dùng không được cung cấp.");
    if (!ID_may_chu) throw new TypeError("Id guild không được cung cấp.");
    const Nguoi_dung = await Cap_bac.findOne({ userID: ID_thanh_vien, guildID: ID_may_chu });
    if (!Nguoi_dung) return false;
    if (Tim_nap_vi_tri === true) {
      const leaderboard = await Cap_bac.find({ guildID: ID_may_chu }).sort([['xp', 'descending']]).exec();
      Nguoi_dung.position = leaderboard.findIndex(i => i.userID === ID_thanh_vien) + 1;
    };
    Nguoi_dung.cleanXp = Nguoi_dung.xp - this.xpFor(Nguoi_dung.level);
    Nguoi_dung.cleanNextLevelXp = this.xpFor(Nguoi_dung.level + 1) - this.xpFor(Nguoi_dung.level);
    return Nguoi_dung;
  };
  static async subtractXp(ID_thanh_vien, ID_may_chu, xp) {
    if (!ID_thanh_vien) throw new TypeError("Một id người dùng không được cung cấp.");
    if (!ID_may_chu) throw new TypeError("Id guild không được cung cấp.");
    if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("Một lượng xp không được cung cấp / không hợp lệ.");
    const Nguoi_dung = await Cap_bac.findOne({ userID: ID_thanh_vien, guildID: ID_may_chu });
    if (!Nguoi_dung) return false;
    Nguoi_dung.xp -= xp;
    Nguoi_dung.level = Math.floor(0.1 * Math.sqrt(Nguoi_dung.xp));
    Nguoi_dung.lastUpdated = new Date();
    Nguoi_dung.save().catch(e => console.log(`Không trừ được xp: ${e}`) );
    return Nguoi_dung;
  };
  static async subtractLevel(ID_thanh_vien, ID_may_chu, Cap_do) {
    if (!ID_thanh_vien) throw new TypeError("Một id người dùng không được cung cấp.");
    if (!ID_may_chu) throw new TypeError("Id guild không được cung cấp.");
    if (!Cap_do) throw new TypeError("Một lượng cấp độ không được cung cấp.");
    const Nguoi_dung = await Cap_bac.findOne({ userID: ID_thanh_vien, guildID: ID_may_chu });
    if (!Nguoi_dung) return false;
    Nguoi_dung.level -= Cap_do;
    Nguoi_dung.xp = Nguoi_dung.level * Nguoi_dung.level * 100;
    Nguoi_dung.lastUpdated = new Date();
    Nguoi_dung.save().catch(e => console.log(`Không thể trừ các cấp: ${e}`) );
    return Nguoi_dung;
  };
  static async computeLeaderboard(client, leaderboard, fetchUsers = false) {
    if (!client) throw new TypeError("Một client không được cung cấp.");
    if (!leaderboard) throw new TypeError("Id bảng xếp hạng không được cung cấp.");
    if (leaderboard.length < 1) return [];
    const computedArray = [];
    if (fetchUsers) {
      for (const key of leaderboard) {
        const user = await client.users.fetch(key.userID) || { username: "Unknown", discriminator: "0000" };
        computedArray.push({
          guildID: key.guildID,
          userID: key.userID,
          xp: key.xp,
          level: key.level,
          position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
          username: user.username,
          discriminator: user.discriminator
        });
      }
    } else {
      leaderboard.map(key => computedArray.push({
        guildID: key.guildID,
        userID: key.userID,
        xp: key.xp,
        level: key.level,
        position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
        username: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).username : "Unknown",
        discriminator: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).discriminator : "0000"
      }));
    };
    return computedArray;
  };
  static xpFor (Muc_tieu_cap_do) {
    if (isNaN(Muc_tieu_cap_do) || isNaN(parseInt(Muc_tieu_cap_do, 10))) throw new TypeError("Mức mục tiêu phải là một số hợp lệ.");
    if (isNaN(Muc_tieu_cap_do)) Muc_tieu_cap_do = parseInt(Muc_tieu_cap_do, 10);
    if (Muc_tieu_cap_do < 0) throw new RangeError("Mức mục tiêu phải là một số dương.");
    return Muc_tieu_cap_do * Muc_tieu_cap_do * 100;
  };
  static async deleteGuild(ID_may_chu) {
    if (!ID_may_chu) throw new TypeError("Id guild không được cung cấp.");
    const May_chu = await Cap_bac.findOne({ guildID: ID_may_chu });
    if (!May_chu) return false;
    await Cap_bac.deleteMany({ guildID: ID_may_chu }).catch(e => console.log(`Không xóa được bang hội: ${e}`));
    return May_chu;
  };
};
module.exports = ranking;