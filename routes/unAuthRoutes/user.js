const express = require("express");
const router = express.Router();
const moment = require("moment");
var jwt = require("jsonwebtoken");
const User = require("../../models/user");
const EmailToken = require("../../models/emailtoken");
const config = require("../../config/config");
const nodemailer = require("nodemailer");
const { SendMail, getEJSTemplate } = require("../../helpers/mailHelper");

router.post("/signup", async function(req, res, next) {
    const user1=new User({
        username:req.body.username,
        "email.eamail":req.body.email,
        "contact.contact":req.body.contact,
        "gender":req.body.gender,
        notif_subscribe:req.body.notif_subscribe
    });
    user1.save().then(async user=>{
        var email_token = jwt
            .sign(
                { _id:user._id, email: user.email },
                config.JWT_SECRET
            )
            .toString();
        var verification_link =
            config.FRONT_HOST + "/gp/sales/verifyemail/" + email_token;
        var emailtoken = new EmailToken({ token: email_token, used: false });
        emailtoken.save().then(async ()=>{
            const ejsTemplate = await getEJSTemplate({
                fileName: "signup.ejs"
            });
            const finalHTML = ejsTemplate({
                time: moment().format("lll"),
                username: req.bodygit .username
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
            return res.headers().json({ success: true });
        })
        .catch(err => {
            console.log(err);
            return next({
                status: 400,
                message: "No sale found",
                stack: err
            });
        });
    }).catch(err => {
        console.log(err);
        return next({
            status: 400,
            message: "No sale found",
            stack: err
        });
    });
});

router.post("/login",(req,res,next)=>{

})

module.exports = router;