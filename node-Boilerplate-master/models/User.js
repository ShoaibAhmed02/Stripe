const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      default: null
    },
 
    email: {
      type: String,
      require: false,
      lowercase: true,
      trim: true,
      match:
        /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: {
      type: String,
      require: true,
    },
    user_image: {
      type: String,
      require: true,
      default: null,
    },
    phone_number: {
      type: String,
      require: true,
      trim: true,
      default : null,
    },
    dob: {
      type: String,
      require: true,
      // trim: true,
      default : null,
    },
    verification_code: {
      type: Number,
      default: null,
    },
    is_verified: {
      type: Number,
      default: 0,
    },
    user_is_profile_complete: {
      type: Number,
      default: 0,
      trim: true,
    },
    user_is_forgot: {
      type: Number,
      default: 0,
    },

    is_blocked: {
      type: Number,
      default: 0,
    },
    user_authentication: {
      type: String,
      required: false,
      default: null,
    },
    user_social_token: {
      type: String,
      require: false,
      trim: true,
      default: null,
    },
    user_social_type: {
      type: String,
      require: false,
      trim: true,
      default: null,
    },
    user_device_type: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    user_device_token: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    is_notification: {
      type: Boolean,
      default: 1,
    },
    is_profile_deleted: {
      type: Boolean,
      default: 0,
    },
  },
  { timestamps: true }
);

// Here generate Auth Token for social login
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id,
    },
    process.env.JWT_KEY
  );
  user.user_authentication = token;
  await user.save();
  //console.log("tokeeen--->", token);
  return token;
};

userSchema.index({ location: '2dsphere' })

const User = mongoose.model("User", userSchema);
module.exports = User;
