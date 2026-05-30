const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const emailSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
});
const emailData = mongoose.model("emails", emailSchema);
module.exports = emailData;
