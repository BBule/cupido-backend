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
    if (req.body.hasOwnProperty("phone") && req.body.phone.verified == false) {
        return res
            .status(400)
            .send({ type: "Phone", message: "Phone no. not verified" });
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

module.exports = router;
