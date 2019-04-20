const express = require("express");
const router = express.Router();
const moment = require("moment");
var jwt = require("jsonwebtoken");
const User = require("../models/user");
const EmailToken = require("../models/emailtoken");
const config = require("../config/config");
const { SendMail, getEJSTemplate } = require("../helpers/mailHelper");

router.post("/edit", async function(req, res, next) {
    let query = { $set: {} };
    if (req.body.hasOwnProperty("phone")) {
        query.$set = { contact: req.body.phone, verified: false };
    }
    if (req.body.hasOwnProperty("email")) {
        var email_token = jwt
            .sign(
                { _id: req.user._id, email: req.body.email },
                config.JWT_SECRET
            )
            .toString();
        var verification_link =
            "https://cupido.netlify.com/verifyemail/" + email_token;
        var emailtoken = new EmailToken({ token: email_token, used: false });
        emailtoken.save();
        //send verification
        const ejsTemplate = await getEJSTemplate({
            fileName: "email_verification.ejs"
        });
        const finalHTML = ejsTemplate({
            time: moment().format("lll"),
            username: req.user.username
                ? req.user.username.split(" ")[0]
                : "Dear",
            link: verification_link //may be format properly before passing it
        });
        const message = {
            to: req.body.email,
            subject: "Please verify your email!",
            body: finalHTML
        };
        await SendMail(message);
    }
    if (req.body.hasOwnProperty("name")) {
        query.$set = { username: req.body.name };
        await User.findOneAndUpdate(req.user._id, query);
    }
    try {
        // var user = User.findOne(req.user._id);
        // res.send(user);
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

router.get("/gift", (req, res) => {
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
                res.status(200).send({
                    giftsdata: "No gifts found"
                });
            } else {
                var startpoint = req.query.offset; // zero
                var howmany = req.query.limit; // ten
                console.log("gift is found and it's code: ");
                console.log(giftsholder[0].giftcode);
                res.status(200).send({
                    giftsdata: giftsholder.splice(startpoint, howmany)
                });
            }
        })
        .catch(err => {
            res.status(400).send("Bad request");
        });
});

router.get("/orders", (req, res) => {
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
                res.status(200).send({
                    ordersdata: "No orders found"
                });
            } else {
                var startpoint = req.query.offset; // zero
                var howmany = req.query.limit; // ten
                console.log("order is found and it's amount: ");
                console.log(ordersholder[0].order_amount);
                res.status(200).send({
                    ordersdata: ordersholder.splice(startpoint, howmany)
                });
            }
        })
        .catch(err => {
            res.status(400).send("Bad request");
        });
});
module.exports = router;
