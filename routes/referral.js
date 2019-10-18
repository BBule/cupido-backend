const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const randomize = require("randomatic");
var mongoose = require("mongoose");

const Referral = require("../models/referral");
const Saleslist = require("../models/saleslist");
const Cupidlove = require("../models/CupidLove.js");

router.post("/send", async (req, res, next) => {
    Referral.findOne({ sale: req.body.sale, createdBy: req.user._id }).then(
        async referral => {
            if (referral) {
                return res.send({ code: referral.code });
            } else {
                await Saleslist.findOne({ _id: req.body.sale }).then(
                    async sale => {
                        const salePrice = sale.salePrice;
                        const referralPercent = sale.referralPercent;
                        if (referralPercent) {
                            const amount = Math.round(
                                (referralPercent * salePrice) / 200,
                                0
                            );
                            var tokens = await Referral.find()
                                .select("code")
                                .then(async referral => {
                                    var token = randomize("Aa0", 5, {
                                        exclude: tokens
                                    });
                                    var referral = new Referral({
                                        code: token,
                                        createdBy: req.user._id,
                                        sale: req.body.sale,
                                        usedBy: [],
                                        // used: false,
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
                        } else {
                            return next({
                                message:
                                    "Referral cannot be generated for this sale.",
                                status: 400
                            });
                        }
                    }
                );
            }
        }
    );
});

router.post("/apply", async (req, res, next) => {
    await Referral.findOne({
        code: req.body.code,
        cart: { $nin: [req.user._id] },
        sale: req.body.sale,
        createdBy: { $ne: req.user._id }
    })
        .then(async referral => {
            // console.log(referral)
            if (referral) {
                let referral1;
                try {
                    referral1 = await Referral.findOne({
                        usedBy: { $in: [req.user._id] },
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
                        code: req.body.code,
                        usedBy: { $in: [req.user._id] }
                        //sale: req.body.sale
                    });
                } catch (err) {
                    console.log(err);
                    return next({
                        message: err || "unknown error",
                        status: 400
                    });
                }
                let referral3;
                try {
                    referral3 = await Referral.findOne({
                        cart: req.user._id,
                        sale: req.body.sale
                    });
                } catch (err) {
                    console.log(err);
                    return next({
                        message: err || "unknown error",
                        status: 400
                    });
                }
                if (referral1 || referral2 || referral3) {
                    return next({
                        message: "You cannot apply this Coupon Code",
                        status: 400
                    });
                } else {
                    await Referral.findByIdAndUpdate(
                        referral._id,
                        {
                            $push: { cart: req.user._id }
                        },
                        { new: true }
                    )
                        .then(referral => {
                            res.send(referral);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            } else {
                return next({
                    status: 400,
                    message: "Invalid Token"
                });
            }
        })
        .catch(err => {
            console.log(err);
            return next({
                message: "Invalid Token",
                status: 400
            });
        });
});

router.post("/remove/:referralId", async (req, res, next) => {
    const referralId = req.params.referralId;
    await Referral.findByIdAndUpdate(
        {
            _id: referralId
        },
        {
            $pull: { cart: req.user._id }
        },
        { new: true }
    )
        .then(referral => {
            res.send(referral);
        })
        .catch(err => {
            console.log(err);
        });
});

router.get("/myReferralsOnThisSale", (req, res, next) => {
    Referral.find({ saleId: req.query.saleId, used: false })
        .then(referrals => {
            return res.send(referrals);
        })
        .catch(err => {
            console.log(err);
            return next({
                message: "Invalid Token",
                status: 400
            });
        });
});

module.exports = router;
