const express = require("express");
const googleUtils = require(".././googleUtils/googleUtils");
const otpUtils = require(".././msg91utils/otputils");
const request = require("request");
const config = require("../config/config");
const router = express.Router();

// Helper Functions
function newIndDate() {
    var nDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta"
    });
    return nDate;
}

// Models
const User = require("../models/user");
router.route("/api/auth/sendotp").post(async function(req, res) {
    var phone = req.body.phone; //along with country code
    request.post(
        "https://control.msg91.com/api/sendotp.php?authkey=" +
            config.msg91_AUTH_KEY +
            "&message=Your%20verification%20code%20is%20%23%23OTP%23%23&sender=LeCupido&mobile=" +
            phone,
        { json: true },
        async function(error, response, body) {
            if (!error) {
                // console.log(body);
                res.send(body);
            } else {
                res.send(error);
            }
        }
    );
});
router.route("/api/verifyotp").post(async function(req, res) {
    var phone = req.body.phone;
    var otp = req.body.otp;
    request.post(
        "https://control.msg91.com/api/verifyRequestOTP.php?authkey=" +
            config.msg91_AUTH_KEY +
            "&mobile=" +
            phone +
            "&otp=" +
            otp,
        { json: true },
        async function(error, response, body) {
            if (!error) {
                if (body.type === "success") {
                    var user = await User.findOne({ "contact.contact": phone });
                    if (user) {
                        user.contact.verified = true;
                        res.send(body);
                    } else {
                        res.status(400).send({
                            message: "Phone no. not registered"
                        });
                    }
                } else {
                    res.status(400).send(body);
                }
            } else {
                res.status(400).send(error);
            }
        }
    );
});

router.route("/api/auth/verifyotp").post(async function(req, res) {
    var phone = req.body.phone;
    var otp = req.body.otp;
    request.post(
        "https://control.msg91.com/api/verifyRequestOTP.php?authkey=" +
            config.msg91_AUTH_KEY +
            "&mobile=" +
            phone +
            "&otp=" +
            otp,
        { json: true },
        async function(error, response, body) {
            if (!error) {
                if (body.type === "success") {
                    var user = await User.findOne({ "contact.contact": phone });
                    if (user) {
                        user.generateAuthToken()
                            .then(function(token) {
                                res.header("x-auth", token).send({
                                    user,
                                    new: false
                                });
                            })
                            .catch(function(e) {
                                res.status(400).send(e);
                            });
                    } else {
                        user = new User({
                            contact: {
                                contact: phone,
                                verified: true
                            }
                        });
                        await user.save();
                        user.generateAuthToken()
                            .then(function(token) {
                                res.header("x-auth", token).send({
                                    user,
                                    new: true
                                });
                            })
                            .catch(function(e) {
                                res.status(400).send(e);
                            });
                    }
                } else {
                    res.status(400).send(body);
                }
            } else {
                res.status(400).send(error);
            }
        }
    );
});
router.route("/api/auth/google").post(async function(req, res) {
    var data = await googleUtils.getGoogleAccountFromCode(req.body.code);
    try {
        var user = await User.findOne({ googleId: data.googleId });
        if (user) {
            user.generateAuthToken()
                .then(function(token) {
                    res.header("x-auth", token).send({ user, new: false });
                })
                .catch(function(e) {
                    res.status(400).send(e);
                });
        } else {
            user = new User(data);
            user.save()
                .then(function() {
                    return user.generateAuthToken();
                })
                .then(function(token) {
                    res.header("x-auth", token).send({ user, new: true });
                })
                .catch(function(e) {
                    res.status(400).send(e);
                });
        }
    } catch (e) {
        console.log(e);
    }
});
router.route("/google/url").get(function(req, res) {
    res.send(googleUtils.urlGoogle());
    console.log(googleUtils.urlGoogle());
});

module.exports = router;
