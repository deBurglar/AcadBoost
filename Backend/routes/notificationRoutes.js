const express = require("express");
const notifRouter = express.Router();
const PushSubscription = require("../models/PushSubscription");
const webPush = require("../utils/pushService");

// save subscription from frontend
notifRouter.post("/subscribe", async (req, res) => {
  try {
    const subscription = req.body;

    // upsert by endpoint (avoid duplicates)
    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      subscription,
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Subscription saved" });
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ error: "Failed to save subscription" });
  }
});

// send notification manually (for testing)
notifRouter.post("/send", async (req, res) => {
  try {
    const { title, body } = req.body;
    console.log('Hello from send')
    const subscriptions = await PushSubscription.find();

    const payload = JSON.stringify({ title, body });

    const sendPromises = subscriptions.map((sub) =>
      webPush.sendNotification(sub, payload).catch((err) => {
        console.error("Push error:", err);
      })
    );

    await Promise.all(sendPromises);

    res.json({ message: "Notifications sent" });
  } catch (err) {
    console.error("Send error:", err);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

notifRouter.get("/publicKey", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});
module.exports = notifRouter;
