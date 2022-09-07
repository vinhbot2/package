'use strict';
const mongoose = require("mongoose");
module.exports = mongoose.model('Inventory-currency', new mongoose.Schema({
      guildID: { type: String, default: null },
      inventory: { type: Array },
      lastUpdated: { type: Date, default: new Date() },
}));