var FCM = require("fcm-node");
var serverKey =
  "AAAAizr_GbM:APA91bHqEUxJR7Ccd4eBqYdHWkIb1WuM_dMDeiTzsYm_reHBVK9MKcIwxfohckNvtakV3frI3cgMlzEoVhn-JjESA7ZFsWiHCak3rprNuUHQlpZkfJNLBbeCOIhJjeUdjhGvLp9nBWCG"; //put your server key here
var fcm = new FCM(serverKey);

const push_notifications = (notification_obj) => {
  var message = {
    to: notification_obj.to,
    collapse_key: "your_collapse_key",

    notification: {
      sender_id: notification_obj.sender_id,
      sender_name: notification_obj.sender_name,
      sender_image: notification_obj.sender_image,
      title: notification_obj.title,
      body: notification_obj.body,
      notification_type: notification_obj.notification_type,
      vibrate: notification_obj.vibrate,
      sound: notification_obj.sound
      //   type: notification_obj.type
    },

    data: {  //you can send only notification or only data(or include both)
      //   sender_object: notification_obj.sender_objects,
      //   receiver_object: notification_obj.receiver_objects,
      sender_id: notification_obj.sender_id,
      sender_name: notification_obj.sender_name,
      sender_image: notification_obj.sender_image,
      notification_type: notification_obj.notification_type,
      vibrate: notification_obj.vibrate,
      sound: notification_obj.sound
      //   sender_object: JSON.parse(notification_obj.sender_objects),
      //   receiver_object: JSON.parse(notification_obj.receiver_objects)

    }



  };
  console.log("message:", message);
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};

module.exports = { push_notifications};

