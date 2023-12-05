const mongoose = require('mongoose');
const appnotificationSchema = new mongoose.Schema({

    title: {
        type: String
    },
    body: {
        type: String
    },
    notification_type: {
        type: String
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    date: {
        type: String
    },
},
    { timestamps: true }
);
const AppNotification = mongoose.model("AppNotification", appnotificationSchema);
module.exports = AppNotification;









