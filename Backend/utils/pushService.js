const webPush = require("web-push");

webPush.setVapidDetails(
  "mailto:test@example.com", 
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = webPush;

