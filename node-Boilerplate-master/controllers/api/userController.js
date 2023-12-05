const User = require("../../models/User");
const Chat = require("../../models/Chat");
const moment = require("moment/moment");
var mongoose = require("mongoose");


//** Get User Profile **//
const userProfile = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.params.id })
        // console.log(user)
        if (!user) {
            res.status(400).json({
                status: 0,
                message: "user not found",
            })
        }

        else {

            return res.status(200).json({
                status: 1,
                message: "User details found successfully",
                data: {
                    name: user?.name,
                    _id: user?._id,
                    user_image: user?.user_image,
                    phone_number: user?.phone_number,
                    dob: user?.dob,
                    user_authentication: user?.user_authentication,
                    email: user?.email,
                    is_verified: user?.is_verified,
                    user_is_profile_complete: user?.user_is_profile_complete,
                    is_notification: user?.is_notification,
                    user_is_forgot: user?.user_is_forgot,
                    user_social_type: user?.user_social_type,
                    user_social_token: user?.user_social_token,
                    user_device_type: user?.user_device_type,
                    user_device_token: user?.user_device_token,
                    createdAt: user?.createdAt,
                    updatedAt: user?.updatedAt,
                    __v: user?.__v
                }
            });

        }


    }
    catch (error) {
        console.log('error *** ', error);
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
}


/** update User Profile **/
const updateProfile = async (req, res) => {
  // console.log(req.files.user_image[0].path);
  try {
    if (!req.body.id) {
      res.status(400).send({
        status: 0,
        message: 'User Id is required.'
      });
    }
    else if (req.user._id != req.body.id) {
      res.status(400).send({
        status: 0,
        message: 'Invalid User ID.'
      });
    }

    else {
      const findUser = await User.findOne({ _id: req.body.id })
      if (findUser) {

        if (!req.user._id) {
          res.status(400).send({
            status: 0,
            message: 'User ID is required'
          });
        }
        else {

          const updateUser = await User.findByIdAndUpdate(
            { _id: req.body.id },
            {
              name: req.body.name,
              user_image: req.file ? req.file.path : req.body.user_image,
              phone_number: req.body.phone_number,
              dob: req.body.dob ? moment(new Date(req.body.dob)).format("YYYY-MM-DD") : findUser?.dob,
            },
            { new: true }
          )
          if (updateUser) {
            return res.status(200).send({
              status: 1,
              message: "Profile Updated Successfully",
              data: {
                name: updateUser.name,
                _id: updateUser._id,
                user_image: updateUser.user_image,
                phone_number: updateUser.phone_number,
                dob: updateUser.dob,
                user_authentication: updateUser.user_authentication,
                email: updateUser?.email,
                is_verified: updateUser.is_verified,
                user_is_profile_complete: updateUser.user_is_profile_complete,
                is_notification: updateUser.is_notification,
                user_is_forgot: updateUser.user_is_forgot,
                user_social_type: updateUser.user_social_type,
                user_social_token: updateUser.user_social_token,
                user_device_type: updateUser.user_device_type,
                user_device_token: updateUser.user_device_token,
                createdAt: updateUser.createdAt,
                updatedAt: updateUser.updatedAt,
                __v: updateUser.__v
              }
            });
          } else {
            res.status(400).send({ status: 0, message: "Something Went Wrong" });
          }
        }
      }
      else {
        res.status(404).send({ status: 0, message: "User Not Found" });
      }
    }
  } catch (error) {
    return res.status(500).send({
      status: 0,
      message: "error:---------- " + error.message,
    });
  }
};

//** Delete User Profile **//
const deleteUserProfile = async (req, res) => {
  try {
    var id = mongoose.Types.ObjectId(req.params.id);
    const userid = id;

    const user = await User.findById(userid);
    if (!user) {
      res.status(404).json({
        status: 0,
        message: "user not found",
      });
    }
    else {
      const userDeleted = await User.findByIdAndUpdate({ _id: userid }, { is_profile_deleted: 1 }, { new: true });
      if (userDeleted) {
        return res.status(200).json({
          status: 1,
          message: "Account deleted successfully",
        });
      } else {
        return res.status(400).json({
          status: 0,
          message: "Something went wrong",
        });
      }
    }
  } catch (error) {
    console.log("error *** ", error);
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};


module.exports = {
  userProfile,
  updateProfile,
  deleteUserProfile,
}
