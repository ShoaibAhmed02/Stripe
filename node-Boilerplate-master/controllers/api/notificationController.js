const AppNotification = require('../../models/AppNotification');
const User = require('../../models/User');
var mongoose = require('mongoose');

const getInAppNotification = async (req, res) => {
  try {
    var notify = []
    // console.log(req.notification._id)
    // var _id = mongoose.mongo.ObjectId(req.notification._id)
    // console.log("notification" , _id)
    const notification = await AppNotification.find({ receiver_id: req.user._id }).populate({ path: 'sender_id', select: ' name user_image ' }).sort({ createdAt: -1 })
    // console.log(notification)
    for (let i = 0; i < notification.length; i++) {

      notify.push({
        _id: notification[i]?._id,
        title: notification[i]?.title,
        body: `${notification[i]?.sender_id?.name ? notification[i]?.sender_id?.name : "Undefined"} ${notification[i]?.body}`,
        notification_type: notification[i]?.notification_type,
        sender_id: notification[i]?.sender_id?._id,
        sender_name: notification[i]?.sender_id?.name ? notification[i]?.sender_id?.name : null,
        sender_image: notification[i]?.sender_id?.user_image ? notification[i]?.sender_id?.user_image : null,
        date: notification[i]?.date,

      })
    }
    // console.log(notify)
    if (notification.length > 0) {
      return res.status(200).send({
        status: 1,
        message: "Notification Found Successfully",
        data: notify

      })

    } else {
      return res.status(404).send({
        status: 0,
        message: "Notifications Not Found ",

      })
    }
  }
  catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
}

const userNotifications = async (req, res) => {
    try {
      if (!req.body.is_notification) {
        res.status(400).json({
            status: 0,
            message: "Select On/Off notification",
        })
    }
      if (req.body.is_notification == "off") {
  
  
        let user = await User.findOneAndUpdate(
          { _id: req.user._id},
          {
            is_notification: 0
          },
          { new: true }
        );
  
  
        res
          .status(200)
          .send({ status: 1, message: "Notification Off"});
  
      } else if (req.body.is_notification == "on" ) {
        let user = await User.findOneAndUpdate(
          { _id: req.user._id },
          {
            is_notification: 1
          },
          { new: true }
        );
        res
          .status(200)
          .send({ status: 0, message: "Notification ON"});
      }
    } catch (e) {
      res.status(500).send({ status: 0, message: " Notification toggle!" });
    }
  };

module.exports = { getInAppNotification, userNotifications }   