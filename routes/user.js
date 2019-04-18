const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.put("/edit", async function(req, res) {
    if (req.body.hasOwnProperty("phone") && req.body.phone.verified == false) {
        return res
            .status(400)
            .send({ type: "Phone", message: "Phone no. not verified" });
    }
    if (req.body.hasOwnProperty("email")) {
        var email_token = jwt
            .sign(
                { _id: user._id.toHexString(), email: req.body.email.email },
                config.JWT_SECRET
            )
            .toString();
        var verification_link =
            "https://cupido.netlify.com/verifyemail/" + email_token;
        var emailtoken = new EmailToken({ token: email_token, used: false });
        emailtoken.save();
        //send verification mail
    }
    try {
        await User.findOneAndUpdate(req.user._id, req.body);
        var user = User.findOne(req.user._id);
        res.send(user);
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Server Error" });
    }
});

module.exports = router;
