// const mongoose = require("mongoose");

// const subscriptionSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false },
//     endpoint: { type: String, required: true, unique: true },
//     expirationTime: { type: Number },
//     keys: {
//       p256dh: { type: String, required: true },
//       auth: { type: String, required: true },
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("PushSubscription", subscriptionSchema);
