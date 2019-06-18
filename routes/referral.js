const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const randomize = require("randomatic");
var mongoose = require("mongoose");

const Referral = require("../models/referral");
const Saleslist = require("../models/saleslist");
const Cupidlove = require("../models/CupidLove.js");

router.post("/send", async (req, res, next) => {
    await Saleslist.findOne({ _id: req.body.sale }).then(async sale => {
        const salePrice = sale.salePrice;
        const referralPercent = sale.referralPercent;
        const amount = (referralPercent * salePrice) / 100;
        var tokens = await Referral.find()
            .select("code")
            .then(async referral => {
                var token = randomize("Aa0", 5, { exclude: tokens });
                var referral = new Referral({
                    code: token,
                    createdBy: req.user._id,
                    sale: req.body.sale,
                    // usedBy: req.body.receiverId,
                    used: false,
                    amount: amount
                });
                referral
                    .save()
                    .then(referral => {
                        res.send({ code: referral.code });
                    })
                    .catch(err => {
                        // console.log(err);
                        return next({
                            message: err || "unknown error",
                            status: 400
                        });
                    });
            });
    });
});

router.post("/apply", async (req, res, next) => {
    await Referral.findOne({
        code: req.body.code,
        used: false,
        sale: req.body.sale,
        createdBy: { $ne: req.user._id }
    })
        .then(async referral => {
            // console.log(referral)
            if (referral) {
                let referral1;
                try {
                    referral1 = await Referral.findOne({
                        createdBy: req.user._id,
                        sale: req.body.sale
                    });
                } catch (err) {
                    console.log(err);
                    return next({
                        message: err || "unknown error",
                        status: 400
                    });
                }
                let referral2;
                try {
                    referral2 = await Referral.findOne({
                        usedBy: req.user._id,
                        sale: req.body.sale
                    });
                } catch (err) {
                    console.log(err);
                    return next({
                        message: err || "unknown error",
                        status: 400
                    });
                }
                if (referral1 || referral2) {
                    return next({
                        message: "You cannot Apply Coupon",
                        status: 400
                    });
                } else {
                    await Referral.findOneAndUpdate(
                        { _id: referral._id },
                        { used: true,usedBy:req.user._id}
                    )
                        .then(referral => {
                            cupidlove1 = new Cupidlove({
                                "Sale.id": req.body.sale,
                                earned: true,
                                "User.id": req.user._id,
                                amount: referral.amount,
                                referralId: referral._id
                            });
                            cupidlove2 = new Cupidlove({
                                "Sale.id": req.body.sale,
                                earned: true,
                                "User.id": referral.createdBy,
                                amount: referral.amount,
                                referralId: referral._id
                            });
                            cupidlove3 = new Cupidlove({
                                "Sale.id": req.body.sale,
                                earned: false,
                                "User.id": req.user._id,
                                amount: referral.amount,
                                referralId: referral._id
                            });
                            const arr = [cupidlove1, cupidlove2, cupidlove3];
                            Cupidlove.insertMany(arr, function(err, result) {
                                if (err) {
                                    console.log(err);
                                    return next({
                                        status: 400,
                                        message: "Unable to add CupidLove"
                                    });
                                }else res.send("Applied");
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            } else {
                console.log(err);
                return next({
                    status: 400,
                    message: "Invalid Token"
                });
            }
        })
        .catch(err => {
            console.log(err);
            return next({
                message: err || "unknown error",
                status: 400
            });
        });
});

// router.get("/cupidlove",(req,res,next)=>{
//     Cupidlove.find().then(loves=>{
//         res.status(200).send(loves);
//     })
// })
module.exports = router;
