/*----------------------------
# Economy
----------------------------*/
'use strict'; 
const event = new (require("events").EventEmitter)();
const hang_ton_kho = require("../Schema/inventory");
const Tien_te = require("../Schema/currency");
const databases = require("mongoose");
let workCooldown = 0; let maxWallet;
let maxBank; let wallet; let bank;
async function info(ID_may_chu, ID_thanh_vien) {
  let Du_lieu = await findUser({ }, ID_may_chu, ID_thanh_vien, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  let Gio_cuoi_cung = true;
  let Cuoi_cung = true;
  let Hang_ngay = true;
  let Hang_tuan = true;
  let Hang_thang = true;
  let An_xin = true;
  let Kiem_tien = true;
  let Cong_viec = true;
  if (Du_lieu.lastBegged !== null && (Du_lieu.begTimeout || 240) - (Date.now() - Du_lieu.lastBegged) / 1000 > 0)
    An_xin = false;
  if (Du_lieu.lastHourly !== null && 3600 - (Date.now() - Du_lieu.lastHourly) / 1000 > 0)
    Gio_cuoi_cung = false;
  if (Du_lieu.lastDaily !== null && 86400 - (Date.now() - Du_lieu.lastDaily) / 1000 > 0)
    Hang_ngay = false;
  if (Du_lieu.lastHafly !== null && 43200 - (Date.now() - Du_lieu.lastHafly) / 1000 > 0)
    Cuoi_cung = false;
  if (Du_lieu.lastQuaterly !== null && 12600 - (Date.now() - Du_lieu.lastQuaterly) / 1000 > 0)
    Kiem_tien = false;
  if (Du_lieu.lastWeekly !== null && 604800 - (Date.now() - Du_lieu.lastWeekly) / 1000 > 0)
    Hang_tuan = false;
  if (Du_lieu.lastMonthly !== null && 2.592e6 - (Date.now() - Du_lieu.lastMonthly) / 1000 > 0)
    Hang_thang = false;
  if (Du_lieu.lastWork !== null && workCooldown - (Date.now() - Du_lieu.lastWork) / 1000 > 0)
    Cong_viec = false;
  return {
    error: false,
    rawData: Du_lieu,
    info: Object.entries({
      Hourly: { used: Gio_cuoi_cung, timeLeft: parseSeconds(Math.floor(3600 - (Date.now() - Du_lieu.lastHourly) / 1000)),},
      Hafly: { used: Cuoi_cung, timeLeft: parseSeconds(Math.floor(43200 - (Date.now() - Du_lieu.lastHafly) / 1000)), },
      Daily: { used: Hang_ngay, timeLeft: parseSeconds(Math.floor(86400 - (Date.now() - Du_lieu.lastDaily) / 1000)),},
      Weekly: { used: Hang_tuan, timeLeft: parseSeconds(Math.floor(604800 - (Date.now() - Du_lieu.lastWeekly) / 1000)), },
      Monthly: { used: Hang_thang, timeLeft: parseSeconds(Math.floor(2.592e6 - (Date.now() - Du_lieu.lastMonthly) / 1000)), },
      Begged: { used: An_xin, timeLeft: parseSeconds(Math.floor((Du_lieu.begTimeout || 240) - (Du_lieu.now() - Du_lieu.lastBegged) / 1000)), },
      Quaterly: { used: Kiem_tien, timeLeft: parseSeconds(Math.floor(12600 - (Date.now() - Du_lieu.lastQuaterly) / 1000)),},
      Work: { used: Cong_viec, timeLeft: parseSeconds(Math.floor(12600 - (Date.now() - Du_lieu.lastWork) / 1000)), },
    }),
  };
}

async function balance(Cai_dat) {
  let Du_lieu = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  if (!Du_lieu.networth) Du_lieu.networth = 0;
  Du_lieu.networth = Du_lieu.wallet + Du_lieu.bank;
  return { rawData: Du_lieu, bank: Du_lieu.bank, wallet: Du_lieu.wallet, networth: Du_lieu.networth };
}

async function leaderboard(ID_may_chu) {
  let Du_lieu = await Tien_te.find({ guildID: ID_may_chu || null });
  Du_lieu.sort((a, b) => {
    return b.networth - a.networth;
  });
  return Du_lieu;
}

async function setBankSpace(ID_thanh_vien, ID_may_chu, So_tien_moi) {
  let Du_lieu = await findUser({}, ID_thanh_vien, ID_may_chu, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const Du_lieu_cu = Du_lieu;
  So_tien_moi = parseInt(So_tien_moi);
  if (!So_tien_moi && So_tien_moi !== 0) return { error: true, type: "no-amount-provided", rawData: Du_lieu, };
  Du_lieu.bankSpace = So_tien_moi;
  await saveUser(Du_lieu);
  event.emit("userUpdate", Du_lieu_cu, Du_lieu);
  if (Du_lieu_cu.bankSpace !== Du_lieu.bankSpace) {
    return { error: false, type: "success", amount: Du_lieu.bankSpace, rawData: Du_lieu, };
  } else {
    return { error: true, type: "same-amount", rawData: Du_lieu, };
  }
}

function updateInventory(Ket_noi_URL, Du_lieu_moi, Cai_dat, Thu_thap = "inventory-currencies") {
 if (typeof Cai_dat.user === "string") Cai_dat.user = { id: Cai_dat.user };
  if (typeof Cai_dat.guild === "string") Cai_dat.guild = { id: Cai_dat.guild };
  if (!Cai_dat.guild) Cai_dat.guild = { id: null };
  let Truy_van = { guildID: Cai_dat.guild.id || null };
  if (Cai_dat.user) Truy_van = { userID: Cai_dat.user.id, guildID: Cai_dat.guild.id || null };
  new (require("mongodb").MongoClient)(Ket_noi_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).connect(function (Dau_ra_loi, databases) {
    if (Dau_ra_loi) return 
  databases.databases(Ket_noi_URL.split("/")[Ket_noi_URL.split("/").length - 1]).collection(Thu_thap).updateOne(Truy_van, {$set: {inventory: Du_lieu_moi},},{ upsert: true },
        function (Dau_ra_loi, res) {
          if (Dau_ra_loi) return 
          if (res.result.n)
          databases.close();
        }
      );
  });
}

async function rob(Cai_dat) {
  if (typeof Cai_dat.guild === "string") Cai_dat.guild.id = Cai_dat.guild;
  if (typeof Cai_dat.user === "string") Cai_dat.user.id = Cai_dat.user;
  if (!Cai_dat.guild) Cai_dat.guild = { id: null };
  let Nguoi_dung_1 = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const oldData = Nguoi_dung_1;
  let Nguoi_dung_2 = await Tien_te.findOne({ userID: Cai_dat.user2.id, guildID: Cai_dat.guild.id || null });
  if (!Nguoi_dung_2) Nguoi_dung_2 = await makeUser(Cai_dat, true);
  const oldData2 = Nguoi_dung_2;
  let lastRob = Nguoi_dung_1.lastRob;
  let timeout = Cai_dat.cooldown;
  if (lastRob !== null && timeout - (Date.now() - lastRob) / 1000 > 0) return { error: true, type: "time", time: parseSeconds(Math.floor(timeout - (Date.now() - lastRob) / 1000))};
  if (Nguoi_dung_1.wallet < Cai_dat.minAmount - 2) return { error: true, type: "low-money", minAmount: Cai_dat.minAmount, };
  if (Nguoi_dung_2.wallet < Cai_dat.minAmount - 2) return { error: true, type: "low-wallet", user2: Cai_dat.user2, minAmount: Cai_dat.minAmount };
  let max = Cai_dat.maxRob;
  if (!max || max < 1000) max = 1000;
  let random = Math.floor(Math.random() * (Math.floor(max || 1000) - 99)) + 99;
  if (random > Nguoi_dung_2.wallet) random = Nguoi_dung_2.wallet;
  Nguoi_dung_1.lastRob = Date.now();
  if (testChance(Cai_dat.successPercentage || 5)) {
    Nguoi_dung_2 = amount(Nguoi_dung_2, "remove", "wallet", random, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    Nguoi_dung_1 = amount(Nguoi_dung_1, "add", "wallet", random, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    await saveUser(Nguoi_dung_1, Nguoi_dung_2);
    event.emit("userUpdate", oldData, Nguoi_dung_1, oldData2, Nguoi_dung_2);
    return { error: false, type: "success", user2: Cai_dat.user2, minAmount: Cai_dat.minAmount, amount: random, };
  } else {
    if (random > Nguoi_dung_1.wallet) random = Nguoi_dung_1.wallet;
    Nguoi_dung_2 = amount(Nguoi_dung_2, "add", "wallet", random, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    Nguoi_dung_1 = amount(Nguoi_dung_1, "remove", "wallet", random, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    await saveUser(Nguoi_dung_1, Nguoi_dung_2);
    event.emit("userUpdate", oldData, Nguoi_dung_1, oldData2, Nguoi_dung_2);
    return { error: true, type: "caught", user2: Cai_dat.user2, minAmount: Cai_dat.minAmount, amount: random, };
  }
}

async function withdraw(Cai_dat) {
  let Du_lieu = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const oldData = Du_lieu;
  let Tien_mat = String(Cai_dat.amount);
  if (!Tien_mat) return { error: true, type: "money", };
  if (Tien_mat.includes("-")) return { error: true, type: "negative-money", };
  if (Tien_mat === "all" || Tien_mat === "max") {
    if (Du_lieu.bank < 1) return { error: true, type: "no-money", };
    Du_lieu.wallet += Du_lieu.bank;
    Du_lieu.bank = 0;
    if (!Du_lieu.networth) Du_lieu.networth = 0;
    Du_lieu.networth = Du_lieu.bank + Du_lieu.wallet;
    event.emit("userUpdate", oldData, Du_lieu);
    await saveUser(Du_lieu);
    return { error: false, rawData: Du_lieu, type: "all-success", };
  } else {
    Tien_mat = parseInt(Tien_mat);
    if (Du_lieu.bank < parseInt(Tien_mat)) return { error: true, type: "low-money", };
    if (isNaN(Tien_mat)) return { error: true, type: "money", };
    if (Tien_mat > Du_lieu.bank) return { error: true, type: "low-money", };
    Du_lieu.wallet += Tien_mat;
    Du_lieu.bank -= Tien_mat;
    await saveUser(Du_lieu);
    event.emit("userUpdate", oldData, Du_lieu);
    return { error: false, type: "success", amount: Tien_mat, rawData: Du_lieu };
  }
}

async function deposite(Cai_dat) {
  let data = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const oldData = data;
  let money = String(Cai_dat.amount);
  if (!money)
    return { error: true, type: "money", };
  if (String(money).includes("-"))
    return { error: true, type: "negative-money", };
  if (money === "all" || money === "max") {
    if (data.wallet === 0)
      return { error: true, type: "no-money", };
    data.bank += data.wallet;
    data.wallet = 0;
    if (data.bankSpace > 0 && data.bank > data.bankSpace) {
      const a = data.bank;
      data.bank = data.bankSpace;
      data.wallet += Math.abs(a - data.bankSpace);
    }
    if (!data.networth) data.networth = 0;
    data.networth = data.bank + data.wallet;
    await saveUser(data);
    event.emit("userUpdate", oldData, data);
    return { error: false, rawData: data, type: "all-success", };
  } else {
    money = parseInt(money);
    if (!money)
      return { error: true, type: "money", };
    if (money > data.wallet)
      return { error: true, type: "low-money", };
    if (data.bankSpace > 0 && data.bank == data.bankSpace)
      return { error: true, type: "bank-full", rawData: data,};
    data.bank += money;
    if (data.wallet - money < 0) {
      const a = data.wallet;
      data.wallet = 0;
      data.bank -= Math.abs(a - money);
    }
    data.wallet -= money;
    if (!data.networth) data.networth = 0;
    data.networth = data.bank + data.wallet;
    if (data.bankSpace > 0 && data.bank > data.bankSpace) {
      const a = data.bank;
      data.bank = data.bankSpace;
      data.wallet += Math.abs(a - data.bankSpace);
    }
    await saveUser(data);
    event.emit("userUpdate", oldData, data);
    return { error: false, rawData: data, type: "success", amount: money, };
  }
}

function setDefaultWalletAmount(So_luong) {
  if (parseInt(So_luong)) wallet = So_luong || 0;
};
function setDefaultBankAmount(So_luong) {
  if (parseInt(So_luong)) bank = So_luong || 0;
};
function setMaxBankAmount(So_luong) {
  if (parseInt(So_luong)) maxBank = So_luong || 0;
};
function setMaxWalletAmount(So_luong) {
  if (parseInt(So_luong)) maxWallet = So_luong || 0;
};

async function globalLeaderboard() {
  let Mang = await Tien_te.find();
  var Dau_ra = [];
  Mang.forEach(function (Mat_hang) {
    var Hien_co = Dau_ra.filter(function (v, i) {
      return v.userID == Mat_hang.userID;
    });
    if (Hien_co.length) {
      var Hien_tai = Dau_ra.indexOf(Hien_co[0]);
      Dau_ra[Hien_tai].bank = Dau_ra[Hien_tai].bank + Mat_hang.bank;
      Dau_ra[Hien_tai].wallet = Dau_ra[Hien_tai].wallet + Mat_hang.wallet;
      Dau_ra[Hien_tai].networth =
      Dau_ra[Hien_tai].wallet + Dau_ra[Hien_tai].bank;
    } else {
      Dau_ra.push(Mat_hang);
    }
  });
  Dau_ra.sort((a, b) => {
    return b.networth - a.networth;
  });
  return Dau_ra;
}

async function work(Cai_dat) {
  let Du_lieu = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const Du_lieu_cu = Du_lieu;
  let Cong_viec = Du_lieu.lastWork;
  let Het_gio = Cai_dat.cooldown;
  workCooldown = Het_gio;
  if (Cong_viec !== null && Het_gio - (Date.now() - Cong_viec) / 1000 > 0) {
    return { error: true, type: "time", time: parseSeconds(Math.floor(Het_gio - (Date.now() - Cong_viec) / 1000))};
  } else {
    let So_tien = Math.floor(Math.random() * Cai_dat.maxAmount || 100) + 1;
    Du_lieu.lastWork = Date.now();
    Du_lieu = amount(Du_lieu, "add", "wallet", So_tien, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    await saveUser(Du_lieu);
    event.emit("userUpdate", Du_lieu_cu, Du_lieu);
    let Ket_qua = Math.floor(Math.random() * Cai_dat.replies.length);
    return { error: false, type: "success", workType: Cai_dat.replies[Ket_qua], amount: So_tien, };
  }
}

async function monthly(Cai_dat) {
  let Du_lieu = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const Du_lieu_cu = Du_lieu;
  let monthly = Du_lieu.lastMonthly;
  let timeout = 2.592e6;
  if (monthly !== null && timeout - (Date.now() - monthly) / 1000 > 0) {
    return { error: true, type: "time", time: parseSeconds(Math.floor(timeout - (Date.now() - monthly) / 1000)), };
  } else {
    Du_lieu.lastMonthly = Date.now();
    Du_lieu = amount(Du_lieu, "add", "wallet", Cai_dat.amount, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    if ((Date.now() - monthly) / 1000 > timeout * 2) Du_lieu.streak.monthly = 0;
    Du_lieu.streak.monthly += 1;
    await saveUser(Du_lieu);
    event.emit("userUpdate", Du_lieu_cu, Du_lieu);
    return { error: false, type: "success", amount: Cai_dat.amount, rawData: Du_lieu, };
  }
}

async function yearly(Cai_dat) {
  let Du_lieu = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const Du_lieu_cu = Du_lieu;
  let yearly = Du_lieu.lastYearly;
  let timeout = 3.156e+10;
  if (yearly !== null && (timeout - (Date.now() - yearly) / 1000) >= 0) {
    return { error: true, type: "time", time: parseSeconds(Math.floor(timeout - (Date.now() - yearly) / 1000)),};
  } else {
    Du_lieu.lastYearly = Date.now();
    Du_lieu = amount(Du_lieu, "add", "wallet", Cai_dat.amount, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    if ((Date.now() - lastYearly) / 1000 > timeout * 2) Du_lieu.streak.yearly = 0;
    Du_lieu.streak.yearly += 1;
    await saveUser(Du_lieu);
    event.emit("userUpdate", Du_lieu_cu, Du_lieu);
    return { error: false, type: "success", amount: Cai_dat.amount, rawData: Du_lieu };
  }
}

async function weekly(Cai_dat) {
  let Du_lieu = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const Du_lieu_cu = Du_lieu;
  let weekly = Du_lieu.lastWeekly;
  let timeout = 604800;
  if (weekly !== null && timeout - (Date.now() - weekly) / 1000 > 0) {
    return { error: true, type: "time", time: parseSeconds(Math.floor(timeout - (Date.now() - weekly) / 1000))};
  } else {
    Du_lieu.lastWeekly = Date.now();
    Du_lieu = amount(Du_lieu, "add", "wallet", Cai_dat.amount, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    if ((Date.now() - Du_lieu.lastWeekly) / 1000 > timeout * 2)
    Du_lieu.streak.weekly = 0;
    Du_lieu.streak.weekly += 1;
    await saveUser(Du_lieu);
    event.emit("userUpdate", Du_lieu_cu, Du_lieu);
    return { error: false,  type: "success", amount: Cai_dat.amount, rawData: Du_lieu, };
  }
}

async function quaterly(Cai_dat) {
  let Du_lieu = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const Du_lieu_cu = Du_lieu;
  let quaterly = Du_lieu.lastQuaterly;
  let timeout = 21600;
  if (quaterly !== null && timeout - (Date.now() - quaterly) / 1000 > 0) {
    return { error: true, type: "time", time: parseSeconds(Math.floor(timeout - (Date.now() - quaterly) / 1000)), };
  } else {
    Du_lieu.lastQuaterly = Date.now();
    Du_lieu = amount(Du_lieu, "add", "wallet", Cai_dat.amount, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    if ((Date.now() - quaterly) / 1000 > timeout * 2) Du_lieu.streak.quaterly = 0;
    Du_lieu.streak.quaterly += 1;
    await saveUser(Du_lieu);
    event.emit("userUpdate", Du_lieu_cu, Du_lieu);
    return { error: false, type: "success", amount: Cai_dat.amount, rawData: Du_lieu, };
  }
}

async function hafly(Cai_dat) {
  let Du_lieu = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const Du_lieu_cu = Du_lieu;
  let hafly = Du_lieu.lastHafly;
  let timeout = 43200;
  if (hafly !== null && timeout - (Date.now() - hafly) / 1000 > 0) {
    return { error: true, type: "time", time: parseSeconds(Math.floor(timeout - (Date.now() - hafly) / 1000)),};
  } else {
    Du_lieu.lastHafly = Date.now();
    Du_lieu = amount(Du_lieu, "add", "wallet", Cai_dat.amount, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    if ((Date.now() - Du_lieu.lastHafly) / 1000 > timeout * 2) Du_lieu.streak.hafly = 0;
    Du_lieu.streak.hafly += 1;
    await saveUser(Du_lieu);
    event.emit("userUpdate", Du_lieu_cu, Du_lieu);
    return { error: false, type: "success", amount: Cai_dat.amount, rawData: Du_lieu };
  }
}

function amount(Du_lieu, Loai_hinh = "add", O_dau = "wallet", So_luong, Mua_hang) {
  if (!Du_lieu.bankSpace) Du_lieu.bankSpace = maxBank || 0;
  if (O_dau === "bank") {
    if (Loai_hinh === "add") Du_lieu.bank += So_luong;
    else Du_lieu.bank -= So_luong;
  } else {
    if (Loai_hinh === "add") Du_lieu.wallet += So_luong;
    else Du_lieu.wallet -= So_luong;
  }
  if (Du_lieu.bankSpace > 0 && Du_lieu.bank > Du_lieu.bankSpace) {
    const a = Du_lieu.bank;
    Du_lieu.bank = Du_lieu.bankSpace;
    Du_lieu.wallet += Math.abs(a - Du_lieu.bankSpace);
  }
  if (!Du_lieu.networth) Du_lieu.networth = 0;
  Du_lieu.networth = Du_lieu.bank + Du_lieu.wallet;
  try {
    event.emit("balanceUpdate", Du_lieu, Mua_hang.split(" ").map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(" "));
  } catch (E) {}
  return Du_lieu;
}

async function daily(Cai_dat) {
  let Du_lieu = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const Du_lieu_cu = Du_lieu;
  let Hang_ngay = Du_lieu.lastDaily;
  let timeout = 86400;
  if (Hang_ngay !== null && timeout - (Date.now() - Hang_ngay) / 1000 > 0) {
    return { error: true, type: "time", time: parseSeconds(Math.floor(timeout - (Date.now() - Hang_ngay) / 1000))};
  } else {
    Du_lieu.lastDaily = Date.now();
    Du_lieu = amount(Du_lieu, "add", "wallet", Cai_dat.amount, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    if ((Date.now() - Hang_ngay) / 1000 > timeout * 2) Du_lieu.streak.daily = 0;
    Du_lieu.streak.daily += 1;
    await saveUser(Du_lieu);
    event.emit("userUpdate", Du_lieu_cu, Du_lieu);
    return { error: false, type: "success", amount: Cai_dat.amount, rawData: Du_lieu, };
  }
}

async function hourly(Cai_dat) {
  let data = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const oldData = data;
  let lastHourly = data.lastHourly;
  let timeout = 3600;
  if (lastHourly !== null && timeout - (Date.now() - lastHourly) / 1000 > 0) {
    return {
      error: true,
      type: "time",
      time: parseSeconds(Math.floor(timeout - (Date.now() - lastHourly) / 1000)),
    };
  } else {
    data.lastHourly = Date.now();
    data = amount(data, "add", "wallet", Cai_dat.amount, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    if ((Date.now() - lastHourly) / 1000 > timeout * 2) data.streak.hourly = 0;
    data.streak.hourly += 1;
    await saveUser(data);
    event.emit("userUpdate", oldData, data);
    return { error: false, type: "success", amount: Cai_dat.amount, rawData: data, };
  }
}

async function beg(Cai_dat) {
  let data = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const oldData = data;
  let beg = data.lastBegged; 
  let timeout = 240;
  if (parseInt(Cai_dat.cooldown)) timeout = parseInt(Cai_dat.cooldown);
  if (beg !== null && timeout - (Date.now() - beg) / 1000 > 0) {
    return { error: true, type: "time", time: parseSeconds(Math.floor(timeout - (Date.now() - beg) / 1000)), };
  } else {
    const amountt = Math.round((Cai_dat.minAmount || 200) + Math.random() * (Cai_dat.maxAmount || 400));
    data.lastBegged = Date.now();
    data.begTimeout = timeout;
    data = amount(data, "add", "wallet", amountt, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    await saveUser(data);
    event.emit("userUpdate", oldData, data);
    return { error: false, type: "success", amount: amountt, };
  }
}

async function addMoneyToAllUsers(Cai_dat) {
  if (String(Cai_dat.amount).includes("-")) return { error: true, type: "negative-money", };
  let amountt = parseInt(Cai_dat.amount) || 0;
  if (typeof Cai_dat.guild === "string")
    Cai_dat.guild = { id: Cai_dat.guild, };
  if (!Cai_dat.guild)
    Cai_dat.guild = { id: null, };
  let data = await Tien_te.find({ guildID: Cai_dat.guild.id || null });
  if (!data) return {berror: true, type: "no-users", };
  const oldData = data;
  data.forEach(async (user) => {
    if (Cai_dat.wheretoPutMoney === "bank") {
      user = amount( user, "add", "bank", amountt, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    } else {
      user = amount(user, "add", "wallet", amountt, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    }
  });
  event.emit("usersUpdate", oldData, data);
  data.forEach((a) =>
    a.save(function (err, saved) {
      if (err) console.log(err);
    })
  );
  return { error: false, type: "success", rawData: data, };
}

async function addMoney(Cai_dat) {
  let Du_lieu = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const Du_lieu_cu = Du_lieu;
  if (String(Cai_dat.amount).includes("-")) return { error: true, type: "negative-money", };
  let So_tien = parseInt(Cai_dat.amount) || 0;
  if (Cai_dat.wheretoPutMoney === "bank") {
    Du_lieu = amount(Du_lieu, "add", "bank", So_tien, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  } else {
    Du_lieu = amount(Du_lieu, "add", "wallet", So_tien, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  };
  event.emit("userUpdate", Du_lieu_cu, Du_lieu);
  await saveUser(Du_lieu);
  return { error: false, type: "success", rawData: Du_lieu };
}

async function removeMoneyFromAllUsers(Cai_dat) {
  if (String(Cai_dat.amount).includes("-")) return { error: true, type: "negative-money", };
  let amountt = parseInt(Cai_dat.amount) || 0;
  if (typeof Cai_dat.guild === "string")
    Cai_dat.guild = { id: Cai_dat.guild };
  if (!Cai_dat.guild)
    Cai_dat.guild = { id: null, };
  let data = await Tien_te.find({ guildID: Cai_dat || null });
  if (!data) return { error: true, type: "no-users", };
  const oldData = data;
  data.forEach(async (user) => {
    if (Cai_dat.wheretoPutMoney === "bank") {
      if (Cai_dat.amount === "all" || Cai_dat.amount === "max") {
        user.bank = 0;
      } else {
        user = amount( user, "remove", "bank", parseInt(Cai_dat.amount) || 0, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
      }
    } else {
      if (Cai_dat.amount === "all" || Cai_dat.amount === "max") {
        user.wallet = 0;
      } else {
        user = amount(user, "remove", "wallet", parseInt(Cai_dat.amount) || 0, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
      }
    }
  });
  event.emit("usersUpdate", oldData, data);
  data.forEach((a) =>
    a.save(function (err, saved) {
      if (err) console.log(err);
    })
  );
  return { error: false, type: "success", rawData: data, };
}

async function removeMoney(Cai_dat) {
  let Du_lieu = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const Du_lieu_cu = Du_lieu;
  if (String(Cai_dat.amount).includes("-")) return { error: true, type: "negative-money", };
  if (Cai_dat.wheretoPutMoney === "bank") {
    if (Cai_dat.amount === "all" || Cai_dat.amount === "max") {
      Du_lieu.bank = 0;
    } else {
      Du_lieu = amount(Du_lieu, "remove", "bank", parseInt(Cai_dat.amount) || 0, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    };
  } else {
    if (Cai_dat.amount === "all" || Cai_dat.amount === "max") { 
      Du_lieu.wallet = 0;
    } else {
      Du_lieu = amount( Du_lieu, "remove", "wallet", parseInt(Cai_dat.amount) || 0, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    };
  }
  await saveUser(Du_lieu);
  event.emit("userUpdate", Du_lieu_cu, Du_lieu);
  return { error: false, type: "success", rawData: Du_lieu, };
}

async function getUserItems(Cai_dat) {
  let Du_lieu = await findUser(Cai_dat, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  return { error: false, inventory: Du_lieu.inventory, rawData: Du_lieu };
}

async function getShopItems(Cai_dat) {
  let Du_lieu = await getInventory(Cai_dat);
  return { error: false, inventory: Du_lieu.inventory, rawData: Du_lieu };
}


async function gamble(settings) {
  let data = await findUser(settings, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const oldData = data;
  const money = parseInt(settings.amount);
  const result = Math.floor(Math.random() * 10);
  const balance = data.wallet;
  let lastGamble = data.lastGamble;
  let cooldown = settings.cooldown || 50;
  if (!money) return { error: true, type: "amount" };
  if (isNaN(money)) return { error: true, type: "nan" };
  if (money > balance || !balance || balance === 0) return { error: true, type: "low-money", neededMoney: Math.abs(balance - money) };
  if (money < settings.minAmount || 0) return { error: true, type: "gamble-limit", minAmount: settings.minAmount || 0 };
  if (lastGamble !== null && cooldown - (Date.now() - lastGamble) / 1000 > 0) return { error: true, type: "time", second: parseSeconds(Math.floor(cooldown - (Date.now() - lastGamble) / 1000))};
  if (result <= 5) {
    data.lastGamble = Date.now();
    data = amount( data, "remove", "wallet", money, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    await saveUser(data);
    return { error: false, type: "lost", amount: money, wallet: data.wallet };
  } else if (result > 5) {
    data.lastGamble = Date.now();
    data = amount(data, "add", "wallet", money, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
    await saveUser(data);
    event.emit("userUpdate", oldData, data);
    return { error: false, type: "won", amount: money, wallet: data.wallet };
  }
}

async function transferMoney(settings) {
  if (typeof settings.user === "string")
    settings.user = { id: settings.user };
  if (typeof settings.guild === "string")
    settings.guild = { id: settings.guild };
  if (!settings.guild)
    settings.guild = { id: null };
  let user1 = await findUser(settings, null, null, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  const oldData = user1;
  let user2 = await Tien_te.findOne({ userID: settings.user2.id, guildID: settings.guild.id || null });
  if (!user2) user2 = await makeUser(settings, true);
  const oldData1 = user2;
  let money = parseInt(settings.amount);
  if (user1.wallet < money) return { error: true, type: "low-money" };
  user1 = amount( user1, "remove", "wallet", money, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  user2 = amount(user2, "add", "wallet", money, arguments.callee.toString().substring(15, arguments.callee.toString().indexOf("(")));
  await saveUser(user1, user2);
  event.emit("userUpdate", oldData, user1, oldData1, user2);
  return { error: false, type: "success", money: money, user: settings.user, user2: settings.user2, rawData: user1, rawData1: user2 };
}

function parseSeconds(giay) {
  if (String(giay).includes("-")) return "0 giây";
  let Ngay = parseInt(giay / 86400);
  giay = giay % 86400;
  let Gio = parseInt(giay / 3600);
  giay = giay % 3600;
  let Phut = parseInt(giay / 60);
  giay = parseInt(giay % 60);
  if (Ngay) {
    return `${Ngay} ngày, ${Gio} giờ, ${Phut} phútt`;
  } else if (Gio) {
    return `${Gio} giờ, ${Phut} phút, ${giay} giây`;
  } else if (Phut) {
    return `${Phut} phút, ${giay} giây`;
  }
  return `${giay} giây(s)`;
}

function testChance(Phan_tram_thanh_cong) {
  let Ngau_nhien_2 = Math.random() * 10;
  return (Ngau_nhien_2 -= Phan_tram_thanh_cong) < 0;
}

async function findUser(Cai_dat, uid, gid, by) {
  if (typeof Cai_dat.user === "string")
    Cai_dat.user = { id: Cai_dat.user };
  if (typeof Cai_dat.guild === "string")
    Cai_dat.guild = { id: Cai_dat.guild };
  if (!Cai_dat.guild)
    Cai_dat.guild = { id: null };
  let Tim_thay = await Tien_te.findOne({ userID: uid || Cai_dat.user.id, guildID: gid || Cai_dat.guild.id || null });
  if (!Tim_thay) Tim_thay = await makeUser(Cai_dat, false, uid, gid);
  if (maxBank > 0 && Tim_thay.bankSpace == 0) Tim_thay.bankSpace = maxBank;
  if (!Tim_thay.streak) Tim_thay.streak = {};
  if (!Tim_thay.streak.hourly) Tim_thay.streak.hourly = 0;
  if (!Tim_thay.streak.daily) Tim_thay.streak.daily = 0;
  if (!Tim_thay.streak.weekly) Tim_thay.streak.weekly = 0;
  if (!Tim_thay.streak.monthly) Tim_thay.streak.monthly = 0;
  if (!Tim_thay.streak.yearly) Tim_thay.streak.yearly = 0;
  if (!Tim_thay.streak.hafly) Tim_thay.streak.hafly = 0;
  if (!Tim_thay.streak.quaterly) Tim_thay.streak.quaterly = 0;
  try {
    event.emit("userFetch", Tim_thay, by.split(" ").map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(" "));
  } catch (e) {}
  return Tim_thay;
}

async function getInventory(Cai_dat) {
  if (typeof Cai_dat.user === "string")
    Cai_dat.user = { id: Cai_dat.user };
  if (typeof Cai_dat.guild === "string")
    Cai_dat.guild = { id: Cai_dat.guild };
  if (!Cai_dat.guild)
    Cai_dat.guild = { id: null };
  let find = await hang_ton_kho.findOne({ guildID: Cai_dat.guild.id || null });
  if (!find) find = await makeInventory(Cai_dat);
  if (find.inventory.length > 0)
    find.inventory.forEach((a) => {
      if (!a.description) a.description = "Không có mô tả.";
    });
  event.emit("guildInventoryFetch", find);
  return find;
};

async function makeInventory(Cai_dat) {
  if (typeof Cai_dat.user === "string")
    Cai_dat.user = { id: Cai_dat.user };
  if (typeof Cai_dat.guild === "string")
    Cai_dat.guild = { id: Cai_dat.guild };
  if (!Cai_dat.guild)
    Cai_dat.guild = { id: null };
  const inventory = new hang_ton_kho({ guildID: Cai_dat.guild.id || null, inventory: [] });
  event.emit("guildInventoryCreate", inventory);
  return inventory;
};

async function makeUser(Cai_dat, Nguoi_dung_2 = false, ID_thanh_vien, ID_may_chu) {
  if (typeof Cai_dat.user === "string")
    Cai_dat.user = { id: Cai_dat.user };
  if (typeof Cai_dat.guild === "string")
    Cai_dat.guild = { id: Cai_dat.guild };
  if (!Cai_dat.guild)
    Cai_dat.guild = { id: null };
  let user = ID_thanh_vien || Cai_dat.user.id;
  if (Nguoi_dung_2) user = Cai_dat.user2.id;
  const newUser = new cs({ userID: user, guildID: ID_may_chu || Cai_dat.guild.id || null, wallet: wallet || 0, bank: bank || 0, bankSpace: maxBank || 0, streak: { hourly: 0, daily: 0, weekly: 0, monthly: 0, yearly: 0, hafly: 0, quaterly: 0 }});
  if (!newUser) throw new Error("Thiếu dữ liệu để tìm nạp từ DB. (Một chức năng trong Hệ thống tiền tệ được sử dụng và userID không được cung cấp.)");
  event.emit("userCreate", newUser);
  return newUser;
};

async function saveUser(Du_lieu1, Du_lieu2) {
  process.nextTick(async () => {
      await sleep(Math.floor(Math.random() * 10 + 1) * 100); // 100 - 1000 máy tạo số ngẫu nhiên
      Du_lieu1.save((_) => _ ? console.error(`LỖI Xảy ra khi lưu dữ liệu (blackcat-club) \n${"=".repeat(50)}\n${_ + "\n" + "=".repeat(50)}`) : "Không có lỗi");
      if (Du_lieu2) Du_lieu2.save((_) => _ ? console.error(`LỖI Xảy ra khi lưu dữ liệu (blackcat-club) \n${"=".repeat(50)}\n${_ + "\n" + "=".repeat(50)}`) : "Không có lỗi");
  }, Du_lieu1, Du_lieu2);
};

function sleep(Mili_giay) {
  return new Promise((Giai_quyet) => {
    setTimeout(Giai_quyet, Mili_giay);
  });
};
module.exports = {
  setDefaultWalletAmount, gamble, withdraw, deposite, balance, leaderboard,
  globalLeaderboard, work, monthly, yearly, weekly, quaterly, hafly, daily,
  hourly, rob, beg, addMoney, removeMoney, transferMoney, getUserItems, getShopItems, 
  findUser, makeUser, saveUser, getInventory, makeInventory, updateInventory, sleep, 
  info, setMaxBankAmount, setMaxWalletAmount, setBankSpace, addMoneyToAllUsers, removeMoneyFromAllUsers, setDefaultBankAmount,
};