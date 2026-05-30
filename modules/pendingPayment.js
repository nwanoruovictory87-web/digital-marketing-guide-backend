const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pendingPaymentTransactions = new Schema({
  paymentId: {
    type: String,
    require: true,
  },
  expireData: {
    type: String,
    require: true,
  },
});
const pendingPayment = mongoose.model(
  "pendingPaymentTransactionsCronJob",
  pendingPaymentTransactions,
);
module.exports = pendingPayment;
