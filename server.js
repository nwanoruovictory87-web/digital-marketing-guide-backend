const express = require("express");
const server = express();
const cors = require("cors");
server.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
const cronJob = require("node-cron");
const mongoose = require("mongoose");

//
//
const emailData = require("./modules/email");
const paymentTransactionsData = require("./modules/payment");
const cronJobPaymentTransaction = require("./modules/pendingPayment");
//
mongoose.connect("mongodb://localhost:27017/").then(() => {
  console.log("connected to database");
  server.listen(3000, () => {
    console.log("server up and runing");
  });
});
//
cronJob.schedule("* * * * *", async () => {
  // fires every 1min
  // would creat paymentTransaction = pending & cronJobPaymentTransaction = pending on email upload
  // and check list every 1 min to see which is still pending if times up i would update paymentTransaction to rejected and delete cronJobPaymentTransaction  of its list
  // so it dosent add up large fiels and it dosent scan all docs
  // if user confirms payment i would update paymentTransaction to pending and delete data from cronJobPaymentTransaction from rejection on timeout
  try {
    console.log("1min");
  } catch (error) {
    console.log(error);
  }
});
const emailValidation = async (req, res, next) => {
  const body = req.body;
  console.log(body);
  if (body === undefined)
    return res
      .status(301)
      .json({ ok: false, massage: "invalid requst body email is required" });
  if (!body.email || body.email.length < 7)
    return res
      .status(301)
      .json({ ok: false, massage: "invalid requst body email is required" });

  const email = body.email;
  res.email = email;
  next();
};
server.post("/email", emailValidation, async (req, res) => {
  const email = {
    email: res.email,
  };
  try {
    const saveEmail = new emailData(email);
    await saveEmail
      .save()
      .then((e) => {
        if (e._id)
          return res.status(201).json({
            ok: true,
            massage: "Email uploaded succesfull",
            redirectUrl: "/dig/payment",
          });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ ok: false, massage: `save email error: ${error}` });
      });
  } catch (error) {
    res.status(500).json({ ok: false, massage: `server error: ${error}` });
  }
});
