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
    require: true,
  },
  data: {
    type: String,
    require: true,
  },
});
const paymentData = mongoose.model("paymentTransactions", paymentTransactions);
module.exports = paymentData;
