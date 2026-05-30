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
const paymentTransactionsData = require("./modules/payment");

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
  try {
    const result = await paymentTransactionsData.updateMany(
      {
        status: "pending",
        expiresAt: { $lte: new Date() },
      },
      {
        status: "rejected",
      },
    );
    if (result.modifiedCount > 0) {
      console.log(`cancelled ${result.modifiedCount} expired payments`);
    }
  } catch (error) {
    console.log(error);
  }
});

const emailValidation = async (req, res, next) => {
  const body = req.body;
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
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    const paymentInfo = {
      email: res.email,
      amount: 3500,
      status: "pending",
      date: `${expiresAt.toLocaleDateString()} ${expiresAt.getHours() >= 10 ? expiresAt.getHours() : "0" + expiresAt.getHours()}:${expiresAt.getMinutes() >= 10 ? expiresAt.getMinutes() : "0" + expiresAt.getMinutes()}`,
      expiresAt,
    };
    const creatPayment = await paymentTransactionsData
      .create(paymentInfo)
      .then((e) => {
        if (e._id)
          return res.status(201).json({
            ok: true,
            massage: "Email uploaded succesfull",
            redirectUrl: `/dmg/payment/${e.email}`,
          });
      });
  } catch (error) {
    res.status(500).json({ ok: false, massage: `server error: ${error}` });
  }
});
server.post("/validate/payment", emailValidation, async (req, res) => {
  try {
    const payment = await paymentTransactionsData.findOneAndUpdate(
      {
        email: res.email,
        status: "pending",
        expiresAt: { $gt: new Date() },
      },
      {
        status: "inreview",
      },
      {
        new: true,
      },
    );
    if (!payment) {
      return res
        .status(400)
        .json({ ok: false, massage: "paymnet expired or already processed" });
    }
    res.status(200).json({
      ok: true,
      massage: "payment inreview we would notify you as soon as its succesfull",
      redirectUrl: `/payment/pending/dmg/${res.email}`,
    });
  } catch (error) {
    res.status(500).json({ ok: false, massage: `server error: ${error}` });
  }
});
//
server.get("/all/payment/transactions", async (req, res) => {
  try {
    const getData = await paymentTransactionsData.find();
    res.status(200).json({ ok: true, massage: "get succesful", data: getData });
  } catch (error) {
    res.status(500).json({ ok: false, massage: `server error : ${error}` });
  }
});
