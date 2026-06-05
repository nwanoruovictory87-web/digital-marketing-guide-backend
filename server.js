const express = require("express");
const server = express();
const cors = require("cors");
require("dotenv").config();
const { BrevoClient } = require("@getbrevo/brevo");
const brevoClient = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

server.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://nwanoruovictory87-web.github.io",
    ],
  }),
);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
const cronJob = require("node-cron");
const mongoose = require("mongoose");

//
//
const paymentTransactionsData = require("./modules/payment");
const validatedEmail = require("./modules/email");
//

mongoose
  .connect(process.env.DataBaseUrl)
  .then(() => {
    console.log("connected to database");
    server.listen(3000, () => {
      console.log("server up and runing");
    });
  })
  .catch((error) => {
    console.log(`database connection error : ${error}`);
  });
//email

async function verifyEmailConnectionAndSendEmail(email) {
  try {
    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Course Access</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;padding:30px 15px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;">

<!-- Header -->
<tr>
<td style="background-color:#6D28D9;padding:40px 30px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:bold;">
🎉 Payment Successful
</h1>

<p style="margin-top:12px;color:#E9D5FF;font-size:16px;">
Your Digital Marketing Course is Ready
</p>
</td>
</tr>

<!-- Welcome -->
<tr>
<td style="padding:40px 30px 20px 30px;">

<p style="margin:0;color:#111827;font-size:18px;">
Hello <strong>${email}</strong>,
</p>

<p style="margin-top:20px;color:#4B5563;font-size:16px;line-height:1.8;">
Thank you for purchasing the
<strong>Digital Marketing Beginner Course</strong>.

Your payment has been successfully confirmed and all your learning resources are now available below.
</p>

</td>
</tr>

<!-- What You Get -->
<tr>
<td style="padding:0 30px;">

<div style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:25px;">

<h2 style="margin-top:0;color:#111827;font-size:22px;">
📦 What You Receive
</h2>

<p style="margin:12px 0;color:#374151;font-size:15px;">
✅ Complete Course PDF
</p>

<p style="margin:12px 0;color:#374151;font-size:15px;">
✅ Video Training Lessons
</p>

<p style="margin:12px 0;color:#374151;font-size:15px;">
✅ WhatsApp Support Group
</p>

<p style="margin:12px 0;color:#374151;font-size:15px;">
✅ Affiliate Marketing Resources
</p>

<p style="margin:12px 0;color:#374151;font-size:15px;">
✅ Bonus Guides & Tools
</p>

</div>

</td>
</tr>

<!-- Buttons -->
<tr>
<td style="padding:35px 30px;">

<h2 style="color:#111827;font-size:22px;">
🚀 Access Your Resources
</h2>


<div style="margin-top:25px;">

<a href="https://drive.google.com/file/d/1tbr2XZwcqZe8SGFxAcDLEjc704_iejf9/view?usp=sharing"
style="background-color:#111827;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:8px;display:inline-block;font-weight:bold;margin-bottom:15px;">
Download Course PDF
</a>

</div>

<div style="margin-top:15px;">

<a href="{{videoLink}}"
style="background-color:#2563EB;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:8px;display:inline-block;font-weight:bold;margin-bottom:15px;">
Watch Training Videos
</a>

</div>

<div style="margin-top:15px;">

<a href="{{affiliatePlatformLink}}"
style="background-color:#059669;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:8px;display:inline-block;font-weight:bold;margin-bottom:15px;">
Open Affiliate Platform
</a>

</div>

<div style="margin-top:15px;">

<a href="https://chat.whatsapp.com/DtaClsk8A7WCgHszKmyMfV"
style="background-color:#25D366;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:8px;display:inline-block;font-weight:bold;">
Join WhatsApp Community
</a>

</div>

</td>
</tr>

<!-- Learning Outcomes -->
<tr>
<td style="padding:0 30px 30px 30px;">
 
<div style="background-color:#F3F4F6;border-radius:10px;padding:25px;">

<h2 style="margin-top:0;color:#111827;">
📚 What You'll Learn
</h2>

<p style="margin:10px 0;color:#4B5563;">
• Digital Marketing Fundamentals
</p>

<p style="margin:10px 0;color:#4B5563;">
• Affiliate Marketing Strategies
</p>

<p style="margin:10px 0;color:#4B5563;">
• How to Generate Sales Online
</p>

<p style="margin:10px 0;color:#4B5563;">
• Paid Advertising Basics
</p>

<p style="margin:10px 0;color:#4B5563;">
• Scaling Your Online Income
</p>

</div>

</td>
</tr>

<!-- Support -->
<tr>
<td style="padding:0 30px 35px 30px;">

<p style="color:#4B5563;font-size:15px;line-height:1.8;">
Please save this email for future reference.

If you experience any issues accessing your course materials, simply reply to this email and support will assist you.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background-color:#111827;padding:30px;text-align:center;">

<h3 style="margin:0;color:#ffffff;">
Coach Victory
</h3>

<p style="margin-top:10px;color:#D1D5DB;font-size:14px;">
Digital Marketing Training Program
</p>

<p style="margin-top:20px;color:#9CA3AF;font-size:13px;">
Learn • Apply • Earn
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
    const result = await brevoClient.transactionalEmails.sendTransacEmail({
      subject: "Course Access - Your Digital Marketing Course is Ready",
      htmlContent: emailTemplate,
      sender: { name: "DMG Team", email: process.env.Email_USER },
      to: [{ email: email }],
    });
    return true;
  } catch (err) {
    console.error("Verification failed:", err);
    return false;
  }
}
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
    //send emil logic
    const findNoneSentEmail = await validatedEmail.find({ emailSent: false });
    if (findNoneSentEmail.length !== 0) {
      const responds = await Promise.all(
        findNoneSentEmail.map(async (e) => {
          const email = e.email;
          const id = e._id;
          const result = await verifyEmailConnectionAndSendEmail(email);
          if (result) {
            await validatedEmail.findByIdAndUpdate(
              { _id: id },
              { emailSent: true },
            );
          }
        }),
      );
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
      date: `${expiresAt.toLocaleDateString()} ${expiresAt.toLocaleTimeString()}`,
      validated: false,
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
//
server.post("/validate/payment/user", emailValidation, async (req, res) => {
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
// admin api endpoints
server.get("/all/payment/transactions", async (req, res) => {
  try {
    const getData = await paymentTransactionsData.find();
    res
      .status(200)
      .json({ ok: true, massage: "Fecth succesful", data: getData });
  } catch (error) {
    res.status(500).json({ ok: false, massage: `server error : ${error}` });
  }
});
//
server.post("/validate/payment/paid/admin", async (req, res) => {
  const paymentId = req.body.paymentId;
  if (!paymentId)
    return res.status(301).json({
      ok: false,
      massage: "invalid requst body paymentid is requied ",
    });
  try {
    const requst = await paymentTransactionsData.findById(paymentId);
    if (requst.validated)
      return res
        .status(303)
        .json({ ok: true, massage: "Email already validated" });
    const validatePayment = await paymentTransactionsData.updateOne(
      { _id: paymentId },
      { status: "succesful", validated: true },
    );
    if (!validatePayment.acknowledged)
      res
        .status(500)
        .json({ ok: false, massage: `server error : something went wrong ` });
    const validateUserEmail = await validatedEmail.create({
      email: requst.email,
      emailSent: false,
    });
    if (validateUserEmail._id) {
      res.status(201).json({ ok: true, massage: "Succesful validate email" });
    }
  } catch (error) {
    res.status(500).json({ ok: false, massage: `server error : ${error}` });
  }
});
server.post("/validate/payment/reject/admin", async (req, res) => {
  const paymentId = req.body.paymentId;
  if (!paymentId)
    return res.status(301).json({
      ok: false,
      massage: "invalid requst body paymentid is requied ",
    });
  try {
    const requst = await paymentTransactionsData.findById(paymentId);
    if (requst.status === "rejected")
      return res
        .status(303)
        .json({ ok: true, massage: "Email already rejected" });
    if (requst.status === "succesful")
      return res
        .status(303)
        .json({ ok: true, massage: "Email already validated" });

    const validatePayment = await paymentTransactionsData.updateOne(
      { _id: paymentId },
      { status: "rejected", validated: false },
    );
    if (!validatePayment.acknowledged)
      res
        .status(500)
        .json({ ok: false, massage: `server error : something went wrong ` });
    res.status(201).json({ ok: true, massage: "Succesful rejected payment" });
  } catch (error) {
    res.status(500).json({ ok: false, massage: `server error : ${error}` });
  }
});
