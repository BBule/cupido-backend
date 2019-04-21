const express = require("express");
var jwt = require("jsonwebtoken");
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
const EmailToken = require("../models/emailtoken");

router.route("/sendotp").post(async function(req, res) {
    var phone = req.body.phone; //along with country code
    request.post(
        "https://control.msg91.com/api/sendotp.php?authkey=" +
            config.SMS.AUTH_KEY +
            "&message=Your%20verification%20code%20is%20%23%23OTP%23%23&sender=" +
            config.SMS.SENDER_ID +
            "&mobile=" +
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
router.route("/phone/verifyotp").post(async function(req, res) {
    var phone = req.body.phone;
    var otp = req.body.otp;
    request.post(
        "https://control.msg91.com/api/verifyRequestOTP.php?authkey=" +
            config.SMS.AUTH_KEY +
            "&mobile=" +
            phone +
            "&otp=" +
            otp,
        { json: true },
        async function(error, response, body) {
            if (!error) {
                if (body.type === "success") {
                    res.send(body);
                } else {
                    res.status(400).send(body);
                }
            } else {
                res.status(400).send(error);
            }
        }
    );
});
router.route("/verifyemail/:token").post(async function(req, res) {
    var token = req.params.token;
    try {
        var emailtoken = await EmailToken.findOne({ token });
        if (emailtoken.used) {
        } else {
            var decoded;

            try {
                decoded = jwt.verify(token, config.JWT_SECRET);
                var user = await User.findOne({
                    _id: decoded._id,
                    "email.email": decoded.email
                });
                user.email.verified = true;
                await user.save();
                res.send({
                    type: "auth",
                    message: "Email verified successfully"
                });
            } catch (e) {
                res.status(400).send({ message: "Invalid Link" });
            }
        }
    } catch (e) {
        res.status(500).send({ message: "Server Error" });
    }
});

router.route("/verifyotp").post(async function(req, res) {
    var phone = req.body.phone;
    var otp = req.body.otp;
    request.post(
        "https://control.msg91.com/api/verifyRequestOTP.php?authkey=" +
            config.SMS.AUTH_KEY +
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
                        const token = jwt.sign(
                            {
                                _id: user._id,
                                email: user.email,
                                username: user.username,
                                contact: user.contact
                            },
                            config.JWT_SECRET,
                            {
                                expiresIn: config.JWT_EXP
                            }
                        );
                        return res.json({ token, user, new: false });
                    } else {
                        user = new User({
                            contact: {
                                contact: phone,
                                verified: true
                            }
                        });
                        if (req.body.referral_code) {
                            const referedBy = await User.findOneAndUpdate(
                                {
                                    refer_code: req.body.referral_code
                                },
                                { $push: { my_referrals: data._id } }
                            )
                                .select("_id")
                                .exec();
                            user["referred_by"] = {
                                user: referedBy._id,
                                code: req.body.referral_code
                            };
                        }

                        await user.save();
                        const token = jwt.sign(
                            {
                                _id: user._id,
                                email: user.email,
                                username: user.username,
                                contact: user.contact
                            },
                            config.JWT_SECRET,
                            {
                                expiresIn: config.JWT_EXP
                            }
                        );
                        return res.json({ token, user, new: true });
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
router.route("/google").post(async function(req, res, next) {
    try {
        var data = await googleUtils.getGoogleAccountFromCode(req.body.code);

        var user = await User.findOne({ googleId: data.googleId });
        if (user) {
            const token = jwt.sign(
                {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    contact: user.contact
                },
                config.JWT_SECRET,
                {
                    expiresIn: config.JWT_EXP
                }
            );
            return res.json({ token, user, new: false });
        } else {
            user = new User(data);
            if (req.body.referral_code) {
                const referedBy = await User.findOneAndUpdate(
                    {
                        refer_code: req.body.referral_code
                    },
                    { $push: { my_referrals: data._id } }
                )
                    .select("_id")
                    .exec();
                user["referred_by"] = {
                    user: referedBy._id,
                    code: req.body.referral_code
                };
            }

            user.save()
                .then(function() {
                    const token = jwt.sign(
                        {
                            _id: user._id,
                            email: user.email,
                            username: user.username,
                            contact: user.contact
                        },
                        config.JWT_SECRET,
                        {
                            expiresIn: config.JWT_EXP
                        }
                    );
                    return res.json({ token, user, new: true });
                })
                .catch(function(e) {
                    res.status(400).send(e);
                });
        }
    } catch (ex) {
        next({ message: "unable to login", status: 400, stack: ex });
    }
});
router.get("/refer_verify", (req, res, next) => {
    if (!req.query.code) {
        return next({
            status: 400,
            message: "invalid request"
        });
    }
    return User.findOne({ refer_code: decodeURIComponent(req.query.code) })
        .exec()
        .then(data => {
            if (data) {
                return res.json({ success: true });
            } else {
                return next({
                    message: "referral code not found",
                    status: 404
                });
            }
        })
        .catch(error => {
            return next({
                message: "unkown error occured",
                status: 400,
                stack: error
            });
        });
});
router.route("/google/url").get(function(req, res) {
    res.send(googleUtils.urlGoogle());
    console.log(googleUtils.urlGoogle());
});

module.exports = router;
