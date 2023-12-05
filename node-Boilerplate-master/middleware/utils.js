const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname == "user_image") {
        cb(null, "./uploads/profile/");
      }
      else if (file.fieldname == "driving_license") {
        // console.log("photos")
        cb(null, "./uploads/driving_license/");
      }
     else if (file.fieldname == "vehicle_images") {
        cb(null, "./uploads/vehicle_images/");
      }
      else if (file.fieldname == "feed_image") {
        // console.log("photos")
        cb(null, "./uploads/feed_images/");
      }
      else if (file.fieldname == "message_image") {
        // console.log("photos")
        cb(null, "./uploads/message_image/");
      }
      else if (file.fieldname == "courseImage") {
        // console.log("photos")
        cb(null, "./uploads/courseImage/");
      }
      else if (file.fieldname == "moduleImage") {
        // console.log("photos")
        cb(null, "./uploads/moduleImage/");
      }
      else if (file.fieldname == "thumbnail") {
        // console.log("photos")
        cb(null, "./uploads/thumbnail/");
      }
      else if (file.fieldname == "main_background") {
        // console.log("photos")
        cb(null, "./uploads/main_background/");
      }
      else if (file.fieldname == "sub_background") {
        // console.log("photos")
        cb(null, "./uploads/sub_background/");
      }
      else if (file.fieldname == "nail") {
        // console.log("photos")
        cb(null, "./uploads/nail/");
      }
      else if (file.fieldname == "finger") {
        // console.log("photos")
        cb(null, "./uploads/finger/");
      }
      else if (file.fieldname == "nail_shadow") {
        // console.log("photos")
        cb(null, "./uploads/nail_shadow/");
      }
      else if (file.fieldname == "nail_background") {
        // console.log("photos")
        cb(null, "./uploads/nail_background/");
      }
      else if (file.fieldname == "full_image") {
        // console.log("photos")
        cb(null, "./uploads/full_image/");
      }
      else if (file.fieldname == "nail_full_image") {
        // console.log("photos")
        cb(null, "./uploads/nail_full_image/");
      }
      else if (file.fieldname == "extra_image") {
        // console.log("photos")
        cb(null, "./uploads/extra_image/");
      }
      else if (file.fieldname == "post_image") {
        // console.log("photos")
        cb(null, "./uploads/post/");
      }
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    },
  });
  function fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
  const upload = multer({
    storage: storage,
    // limits: {
    //   fileSize: 1024 * 1024 * 5,
    // },
    // fileFilter: fileFilter,
  });

  module.exports = {upload};