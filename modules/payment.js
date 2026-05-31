const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paymentTransactions = new Schema({
  email: {
    type: String,
    require: true,
  },
  amount: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["pending", "succesful", "rejected", "inreview"],
    default: "pending",
  },
  date: {
    type: String,
    require: true,
  },
  validated: {
    type: Boolean,
    require: true,
  },
  expiresAt: {
    type: Date,
    index: true,
  },
});
const paymentData = mongoose.model("paymentTransactions", paymentTransactions);
module.exports = paymentData;
