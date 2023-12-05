const { hash } = require("bcrypt");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const moment = require("moment/moment");
const  sendEmail  = require("../../config/mailer");
// const stripe = require('stripe')(process.env.STRIPE_KEY);

/** Login user */
const login = async (req, res) => {
    try {
        const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!req.body.email) {
            return res.status(400).send({
                status: 0,
                message: "Email field is required.",
            });
        } else if (!req.body.password) {
            return res.status(400).send({
                status: 0,
                message: "Password field is required.",
            });
        } else if (!req.body.email.match(emailValidation)) {
            return res.status(400).send({
                status: 0,
                message: "Invalid email address"
            })
        }
        else if (!req.body.user_device_type) {
            return res.status(400).send({
                status: 0,
                message: "User Device Type field is required"
            });
        } else if (!req.body.user_device_token) {
            return res.status(400).send({
                status: 0,
                message: "User Device Token field is required"
            });
        }

        else {

            const findUserDetails = await User.findOne({ email: req.body.email });
            if (findUserDetails) {

                const isMatch = await bcrypt.compare(req.body.password, findUserDetails?.password)
                if (!isMatch) {
                    return res.status(400).send({ status: 0, message: "Password is incorrect" });
                }

                if (findUserDetails?.is_verified === 0) {
                    return res.status(200).send({
                        status: 1,
                        message: "Verify your profile",
                        data: {
                            name: findUserDetails?.name,
                            _id: findUserDetails?._id,
                            user_image: findUserDetails?.user_image,
                            phone_number: findUserDetails?.phone_number,
                            dob: findUserDetails?.dob,
                            user_authentication: findUserDetails?.user_authentication,
                            is_verified: findUserDetails?.is_verified,
                            email: findUserDetails?.email,
                            user_is_profile_complete: findUserDetails?.user_is_profile_complete,
                            is_notification: findUserDetails?.is_notification,
                            user_is_forgot: findUserDetails?.user_is_forgot,
                            user_social_type: findUserDetails?.user_social_type,
                            user_social_token: findUserDetails?.user_social_token,
                            user_device_type: findUserDetails?.user_device_type,
                            user_device_token: findUserDetails?.user_device_token,
                            createdAt: findUserDetails?.createdAt,
                            updatedAt: findUserDetails?.updatedAt,
                            __v: findUserDetails?.__v
                        }
                    });
                }
                else if (findUserDetails.is_blocked == 1) {
                    return res.status(400).send({
                        status: 0,
                        message: "You are temporarily blocked by Admin",
                    });
                }
                else if (findUserDetails.is_profile_deleted == 1) {
                    return res.status(400).send({
                        status: 0,
                        message: "Account has been deleted",
                    });
                } else {
                    await findUserDetails.generateAuthToken();
                    const updateUser = await User.findOneAndUpdate({ _id: findUserDetails._id }, {
                        user_device_type: req.body.user_device_type,
                        user_device_token: req.body.user_device_token
                    }, { new: true })

                    return res.status(200).send({
                        status: 1, message: "Login successfully",
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
                    })
                }
            }
            else {
                return res.status(400).send({
                    status: 0,
                    message: "User Not Found"
                })

            }

        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            status: 0,
            message: error.message,
        });
    }
};

/** Register user */
const register = async (req, res) => {
    try {
        const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if (!req.body.email) {
            res.status(400).send({
                status: 0,
                message: "Email is required",
            });
        } else if (!req.body.password) {
            res.status(400).send({
                status: 0,
                message: "Password is required",
            });
        }
        else if (!req.body.email.match(emailValidation)) {
            return res
                .status(400)
                .send({ status: 0, message: "Invalid email address" });
        }
        else if (!req.body.password.match(pass)) {
            return res.status(400).send({
                status: 0,
                message: "Password should be 8 characters long (should contain uppercase, lowercase, numeric and special character)",
            });
        } else if (!req.body.confirm_password) {
            return res.status(400).send({
                status: 0,
                message: "Confirm Password is required"
            })
        } else if (req.body.password != req.body.confirm_password) {
            return res.status(400).send({
                status: 0,
                message: "Password and Confirm Password must be same"
            })
        }
        else {

            // const verificationCode = Math.floor(100000 + Math.random() * 900000);
           

            const verificationCode =  Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000

            const findEmail = await User.find({ email: req.body.email });
           
            if (findEmail.length < 1) {


                const hashPassword = await bcrypt.hash(req.body.password, 10);

                const user = new User({
                    email: req.body.email,
                    password: hashPassword,
                    user_device_type: req.body.user_device_type,
                    user_device_token: req.body.user_device_token,
                    verification_code: verificationCode,
                });
                await user.save();
                if (user) {
                    let subject = "For Registration Verification code"
                    let random = verificationCode
                    sendEmail(user.name,user.email,subject,random)
                    return res.status(200).send({
                        status: 1,
                        message: 'User registered successfully',
                        data: {
                            _id: user._id,
                        }
                    });
                } else {
                    return res.status(400).send({
                        status: 0,
                        message: 'User registration failed.',
                    });
                }
            } else {
                return res.status(400).send({
                    status: 0,
                    message: "Email already exists!",
                });
            }




        }
    } catch (error) {
        return res.status(500).send({
            status: 0,
            message: error.message,
        });
    }
};

/** Verify user */
const verifyUser = async (req, res) => {
    try {
        if (!req.body.user_id) {
            res.status(400).send({
                status: 0,
                message: "User ID is required",
            });
        } else if (!req.body.verification_code) {
            res.status(400).send({
                status: 0,
                message: "Verification code is required",
            });
        } else {
            const findUser = await User.findOne({ _id: req.body.user_id });

            if (findUser) {
                if (req.body.verification_code == findUser?.verification_code) {

                    await findUser.generateAuthToken();

                    const updateUser = await User.findOneAndUpdate({ _id: findUser._id }, {
                        user_device_type: req.body.user_device_type,
                        user_device_token: req.body.user_device_token,
                        is_verified: 1, verification_code: null,
                    }, { new: true })


                    if (updateUser) {
                        return res.status(200).send({
                            status: 1, message: "OTP matched successfully",
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

                    }
                    else {
                        return res.status(400).send({
                            status: 0,
                            message: "Something went wrong.",
                        });
                    }

                }
                else {
                    return res.status(400).send({
                        status: 0,
                        message: "Invalid OTP verification code.",
                    });
                }
            } else {
                return res.status(400).send({
                    status: 0,
                    message: "User not found",
                });
            }

        }

    } catch (error) {
        return res.status(500).send({
            status: 0,
            message: error.message,
        });
    }
};

/** Resend code */
const resendCode = async (req, res) => {
    try {
        if (!req.body.user_id) {
            res.status(400).send({
                status: 0,
                message: "User id failed is required.",
            });
        }
        else {
            // const verificationCode = Math.floor(100000 + Math.random() * 900000);
            const verificationCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
            const findUser = await User.findOne({ _id: req.body.user_id });

            if (findUser) {
                const updateUser = await User.findOneAndUpdate({ _id: req.body.user_id }, { verification_code: verificationCode }, { new: true })
                if (updateUser) {
                    sendEmail(updateUser.email,updateUser.name ,verificationCode, "Verification Code Resend");
                    return res.status(200).send({
                        status: 1,
                        message: "We have resend OTP verification code at your email address",
                    });

                } else {
                    return res.status(400).send({
                        status: 0,
                        message: "Something went wrong.",
                    });
                }
            }
            else {
                return res.status(400).send({
                    status: 0,
                    message: "User not found",
                });
            }
        }

    } catch (error) {
        return res.status(500).send({
            status: 0,
            message: "Someething went wrong",
        });
    }
};

/** Forgot password */
const forgotPassword = async (req, res) => {
    try {
        if (!req.body.email) {
            res.status(400).send({
                status: 0,
                message: "Email field is required",
            });
        }
        //else if (!req.body.role) {
        //     return res.status(400).send({
        //         status: 0,
        //         message: "User role is required"
        //     })
        // }
        else {
            const findUser = await User.findOne({ email: req.body.email });
            if (findUser) {
                // const verificationCode = Math.floor(100000 + Math.random() * 900000);
                const verificationCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
                const updateUser = await User.findOneAndUpdate({ _id: findUser._id }, { user_is_forgot: 1, verification_code: verificationCode, is_verified:1 }, { new: true })
                if (updateUser) {
                    sendEmail(findUser.email, updateUser.name ,verificationCode, "Forgot Password");
                    return res.status(200).send({
                        status: 1,
                        message: "OTP verification code has been sent to your email address",
                        data: {
                            _id: updateUser._id,
                            is_verified: updateUser.is_verified,
                            user_is_forgot: updateUser.user_is_forgot
                        },
                    })
                } else {
                    return res.status(400).send({
                        status: 0,
                        message: "Something went wrong.",
                    });
                }
            }
            else {
                return res.status(400).send({
                    status: 0,
                    message: "Invalid email address",
                });
            }

        }
    } catch (error) {
        return res.status(500).send({
            status: 0,
            message: "Someething went wrong",
        });
    }
};

/** Reset password */
const resetPassword = async (req, res) => {
    try {
        const {user_id,new_password,confirm_new_password}= req.body
        console.log(user_id,new_password,confirm_new_password)
        const pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/

        if (!req.body.user_id) {
            res.status(400).send({
                status: 0,
                message: "User id field is required.",
            });
        } 
        else if (!req.body.new_password) {
            res.status(400).send({
                status: 0,
                message: "New password field is required.",
            });
        } 
        else if (!req.body.confirm_new_password) {
            return res.status(400).send({
                status: 0,
                message: "Confirm Password field can't be empty"
            })
        } 
        else if (!req.body.confirm_new_password.match(pass) || !req.body.new_password.match(pass)) {
            return res.status(400).send({
                status: 0,
                message: "Password should be 8 characters long (should contain uppercase, lowercase, numeric and special character)"
            })
        } 
        else if (req.body.new_password != req.body.confirm_new_password) {
            return res.status(400).send({
                status: 0,
                message: "New Password and Confirm New Password must be same"
            })
        } 
        else {
            const findUser = await User.findOne({ _id: req.body.user_id });
          
            if (findUser) {
                if (findUser.is_verified === 0) {
                    return res.status(200).send({ status: 1, message: "Verify your account" })
                }
                const salt = await bcrypt.genSalt(10);
                const pass = await bcrypt.hash(req.body.new_password, salt);
                const user = await User.findByIdAndUpdate({ _id: findUser._id }, { password: pass, user_is_forgot: 0, is_verified: 1, verification_code: null }, { new: true })
                if (user) {
                    return res.status(200).send({
                        status: 1,
                        message: "Password updated successfully",
                        // data: { user_id: user._id }
                    })
                }
                else {
                    return res.status(400).send({
                        status: 0,
                        message: "Something went wrong.",
                    });
                }
            } else {
                return res.status(400).send({
                    status: 0,
                    message: "User not found",
                });
            }

        }
    } catch (error) {
        return res.status(500).send({
            status: 0,
            message: error.message,
        });
    }
};

//** Logout **//
const logOut = async (req, res) => {
    
    try {
        if (!req.body.user_id) {
            return res.status(400).send({
                status: 0,
                message: "User ID field is required"
            });
        } 

        else if (!req.headers.authorization) {
            return res.status(401).send({
                status: 0,
                message: "Authentication Field is required"
            });

        } 
        else {


            const updateUser = await User.findOneAndUpdate(
                { _id: req.body.user_id },
                {
                    user_authentication: null,
                    user_device_type: null,
                    user_device_token: null,
                }
            );
            updateUser.save();
            // console.log(req.headers['authorization']);
            res.removeHeader("authorization");
            return res.status(200).send({
                status: 1,
                message: "Logout successfully"
            });

        }
    } catch (error) {
        return res.status(500).send({
            status: 0,
            message: "Someething went wrong",
        });
    }
};

//** Change Password **//
const changePassword = async (req, res) => {
    try {
        const pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
        // if (!req.body.user_id) {
        //     return res.status(400).send({
        //         status: 0,
        //         message: "User id field is required.",
        //     });
        // } else 
        if (!req.body.old_password) {
            return res.status(400).send({
                status: 0,
                message: "Old Password field is required"
            });
        } else if (!req.body.new_password) {
            return res.status(400).send({
                status: 0,
                message: "New password field is required.",
            });
        } else if (!req.body.confirm_new_password) {
            return res.status(400).send({
                status: 0,
                message: "Confirm Password field can't be empty"
            })
        } else if (!req.body.confirm_new_password.match(pass) || !req.body.new_password.match(pass)) {
            return res.status(400).send({
                status: 0,
                message: "Password should be 8 characters long (should contain uppercase, lowercase, numeric and special character)"
            })
        } else if (req.body.new_password != req.body.confirm_new_password) {
            return res.status(400).send({
                status: 0,
                message: "New Password and Confirm New Password must be same"
            })
        }
        else {
            const userFind = await User.findOne({ _id: req.user._id });
            if (userFind) {

                const oldPassword = await bcrypt.compare(
                    req.body.old_password,
                    userFind.password
                );

                if (!oldPassword) {
                    return res.status(400).send({
                        status: 0,
                        message: "Incorrect old password",
                    });
                }

                const checkingOldPassword = await bcrypt.compare(
                    req.body.new_password,
                    userFind.password
                );

                if (checkingOldPassword) {
                    return res.status(400).send({
                        status: 0,
                        message: "Old password and New password can't be same",
                    });
                }
                if (userFind && oldPassword == true) {
                    const newPassword = await bcrypt.hash(req.body.new_password, 10);
                    const updatePassword = await User.findOneAndUpdate(
                        { _id: req.user._id },
                        { password: newPassword },
                        { new: true }
                    );
                    if (updatePassword) {
                        return res.status(200).send({
                            status: 1,
                            message: "New password Updated Successfully.",
                        });
                    }

                } else {
                    res.status(400).send({ status: 0, message: "Old password is incorrect" });
                }
            } else {
                res.status(400).send({ status: 0, message: "Something Went Wrong." });
            }
        }
    } catch (error) {
        return res.status(500).send({
            status: 0,
            message: "Someething went wrong",
        });
    }
};

/** Social Login */
const socialLogin = async (req, res) => {
    try {
        if (!req.body.user_social_token) {
            return res
                .status(400)
                .send({ status: 0, message: "User Social Token field is required" });
        } else if (!req.body.user_social_type) {
            return res
                .status(400)
                .send({ status: 0, message: "User Social Type field is required" });
        } else if (!req.body.user_device_type) {
            return res
                .status(400)
                .send({ status: 0, message: "User Device Type field is required" });
        } else if (!req.body.user_device_token) {
            return res
                .status(400)
                .send({ status: 0, message: "User Device Token field is required" });
        }
        else {
            const checkUser = await User.findOne({
                user_social_token: req.body.user_social_token,
            });
            if (!checkUser) {


                const newRecord = new User({
                    user_social_token: req.body.user_social_token,
                    user_social_type: req.body.user_social_type,
                    user_device_token: req.body.user_device_token,
                    user_device_type: req.body.user_device_type,
                    is_verified: 1,
                });
                await newRecord.generateAuthToken();
                await newRecord.save();
                const updateUser = await User.findOne({ _id: newRecord?._id })
                if (updateUser) {
                    return res.status(200).send({
                        status: 1,
                        message: "Login successfully",
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
                        },
                    });

                } else {
                    return res.status(400).send({
                        status: 0,
                        message: "something went wrong",
                    });
                }


            }
            else {

                const token = await checkUser.generateAuthToken();
                const updateUser = await User.findOneAndUpdate(
                    { _id: checkUser._id },
                    {
                        user_authentication: token,
                        user_device_type: req.body.user_device_type,
                        user_device_token: req.body.user_device_token,
                    },
                    { new: true }
                )
                if (updateUser) {
                    return res.status(200).send({
                        status: 1,
                        message: "Login successfully",
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
                        },
                    });

                } else {
                    return res.status(400).send({
                        status: 0,
                        message: "something went wrong",
                    });
                }
            }
        }
    } catch (error) {
        return res.status(500).send({
            status: 0,
            message: error.message,
        });
    }
};

/** Complete User Profile **/
const completeProfile = async (req, res) => {
    // console.log(req.files.user_image[0].path);
    try {

        if (!req.body.id) {
            res.status(400).send({
                status: 0,
                message: 'User Id is required.'
            });
        }        
        else if (!req.body.name) {
            res.status(400).send({
                status: 0,
                message: 'Name field is required.'
            });
        }        
        else if (!req.body.dob) {
            res.status(400).send({
                status: 0,
                message: 'Date of birth field is required.'
            });
        }       
        else if (!req.body.phone_number) {
            res.status(400).send({
                status: 0,
                message: 'Phone number field is required.'
            });
        }

        else {
            const findUser = await User.findOne({ _id: req.body.id })
            if (findUser) {
                    const updateUser = await User.findByIdAndUpdate(
                        { _id: req.body.id },
                        {
                            name: req.body.name,
                            user_image: req.file ? req.file.path : req.body.user_image,
                            phone_number: req.body.phone_number,
                            dob: moment(new Date(req.body.dob)).format("YYYY-MM-DD"),
                            user_is_profile_complete: 1,
                        },
                        { new: true }
                    )
                    if (updateUser) {
                        return res.status(200).send({
                            status: 1,
                            message: "Profile Completed Successfully",
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
             else {
                res.status(400).send({ status: 0, message: "User Not Found" });
            }
        }
    } catch (error) {
        return res.status(500).send({
            status: 0,
            message: "error:---------- " + error.message,
        });
    }
};

module.exports = {
    register,
    login,
    verifyUser,
    resendCode,
    forgotPassword,
    resetPassword,
    changePassword,
    socialLogin,
    completeProfile,
    logOut,
};
