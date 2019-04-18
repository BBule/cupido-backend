const express = require("express");
const router = express.Router();
const moment = require("moment");
var jwt = require("jsonwebtoken");
const User = require("../models/user");
const EmailToken = require("../models/emailtoken");
const config = require("../config/config");
const { SendMail, getEJSTemplate } = require("../helpers/mailHelper");

router.post("/edit", async function(req, res) {
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
        return res.json({ success: true });
    }
    // try {
    //     await User.findOneAndUpdate(req.user._id, req.body);
    //     var user = User.findOne(req.user._id);
    //     res.send(user);
    // } catch (e) {
    //     console.log(e);
    //     res.status(500).send({ message: "Server Error" });
    // }
});

module.exports = router;
