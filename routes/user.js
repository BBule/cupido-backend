const express = require("express");
const router = express.Router();
const moment = require("moment");
var jwt = require("jsonwebtoken");
const User = require("../models/user");
const EmailToken = require("../models/emailtoken");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const { SendMail, getEJSTemplate } = require("../helpers/mailHelper");

router.post("/edit", async function(req, res, next) {
    let query = { $set: {} };
    if (req.body.hasOwnProperty("mobile")) {
        query.$set = { contact: req.body.mobile, verified: true };
    }
    if (req.body.hasOwnProperty("email")) {
        var email_token = jwt
            .sign(
                { _id: req.user._id, email: req.body.email },
                config.JWT_SECRET
            )
            .toString();
        var verification_link =
            config.FRONT_HOST + "/gp/sales/verifyemail/" + email_token;
        var emailtoken = new EmailToken({ token: email_token, used: false });
        emailtoken.save();
        //send verification
        console.log(verification_link);
        const ejsTemplate = await getEJSTemplate({
            fileName: "email_verification.ejs"
        });
        const finalHTML = ejsTemplate({
            time: moment().format("lll"),
            username: req.user.username
                ? req.user.username.split(" ")[0]
                : "Dear",
            link: verification_link
        });
        const message = {
            to: req.body.email,
            subject: "Please verify your email!",
            body: finalHTML
        };
        await SendMail(message);
    }
    if (req.body.hasOwnProperty("full_name")) {
        query.$set = { username: req.body.full_name };
    }
    if (req.body.hasOwnProperty("gender")) {
        query.$set = { gender: req.body.gender };
    }
    try {
        // var user = User.findOne(req.user._id);
        // res.send(user);
        if (Object.keys(query.$set).length) {
            await User.findOneAndUpdate(req.user._id, query);
        }
        return res.json({ success: true });
    } catch (e) {
        console.log(e);
        return next({
            message: e.message || "unknown error",
            status: 400,
            stack: e
        });
    }
});

router.get("/gift", (req, res, next) => {
    var giftsholder;
    var curruser = req.user._id;
    console.log(req.originalUrl);
    User.findOne({ _id: curruser })
        .then(result => {
            giftsholder = result.mygifts; // Array of gifts of the current user
        })
        .then(() => {
            if (giftsholder == null || giftsholder.length == 0) {
                console.log("No gifts found");
                res.send({
                    giftsdata: []
                });
            } else {
                var startpoint = req.query.offset; // zero
                var howmany = req.query.limit; // ten
                console.log("gift is found and it's code: ");
                console.log(giftsholder[0].giftcode);
                res.send({
                    giftsdata: giftsholder.splice(startpoint, howmany)
                });
            }
        })
        .catch(err => {
            return next({
                stack: err,
                status: 400,
                message: "bad request!"
            });
        });
});

router.get("/orders", (req, res, next) => {
    var ordersholder;
    var curruser = req.user._id;
    console.log(req.originalUrl);
    User.findOne({ _id: curruser })
        .then(result => {
            ordersholder = result.myorders; // Array of orders of the current user
        })
        .then(() => {
            if (ordersholder == null || ordersholder.length == 0) {
                console.log("No orders found");
                res.send({
                    ordersdata: []
                });
            } else {
                var startpoint = req.query.offset; // zero
                var howmany = req.query.limit; // ten
                console.log("order is found and it's amount: ");
                console.log(ordersholder[0].order_amount);
                res.send({
                    ordersdata: ordersholder.splice(startpoint, howmany)
                });
            }
        })
        .catch(err => {
            return next({
                stack: err,
                status: 400,
                message: "bad request!"
            });
        });
});

router.get("/my_refers", (req, res, next) => {
    return User.findOne({ _id: req.user._id })
        .populate("my_referrals", "username")
        .exec()
        .then(data => {
            return res.json(data);
        })
        .catch(err => {
            console.log(err);
            return next({
                status: 400,
                message: "unknown error occurred",
                stack: err
            });
        });
});

router.post("/add_referral_code", (req, res, next) => {
    return User.findOne({
        _id: req.user._id,
        refer_code: { $exists: false }
    }).exec(async (err, doc) => {
        if (err) {
            console.log(err);
            return next({
                status: 400,
                message: "unknown error occured",
                stack: err
            });
        }
        if (!doc) {
            return next({ status: 404, message: "Already applied" });
        }
        try {
            const referedBy = await User.findOneAndUpdate(
                {
                    refer_code: req.body.referral_code
                },
                { $push: { my_referrals: data._id } }
            )
                .select("_id")
                .exec();
            doc.referred_by = {
                user: referedBy._id,
                code: req.body.referral_code
            };
            doc.save();
            return res.json({ success: true });
        } catch (ex) {
            console.log(ex);
            return next({
                stack: ex,
                status: 400,
                message: "unknown error odcured"
            });
        }
    });
});
module.exports = router;
