const express = require("express");
const router = express.Router();
const jwt=require('jsonwebtoken');
const randomize = require('randomatic');
var mongoose = require('mongoose');

const Referral=require("../models/referral");
const Saleslist=require("../models/saleslist");
const User=require("../models/user.js");

router.get("/send", async (req, res, next) => {
    await Saleslist.findOne({_id:req.query.sale}).then(async sale=>{
        const salePrice=sale.salePrice;
        const referralPercent=sale.referralPercent;
        const amount= referralPercent * salePrice;
        var tokens=await Referral.find().select('code').then(async referral=>{
            var token = randomize('Aa0', 5,{exclude:tokens});
            var referral=new Referral({code:token,createdBy:req.user._id,sale:req.query.sale,usedBy:req.query.receiverId,used:false,amount:amount});
            referral.save().then(referral=>{
                res.send({code:referral.code});
            }).catch(err=>{
                // console.log(err);
                return next({
                    message: err || "unknown error",
                    status: 400
                });
            })
        })
    })
});
router.get("/apply", async (req, res, next) => { 
    await Referral.findOne({code:req.query.code,used:false,sale:req.query.sale,createdBy: { $ne: req.user._id }}).then(async referral=>{
        if(referral){
            await Referral.findOneAndUpdate({_id:referral._id},{used:true}).then(referral=>{
                arr=[referral.createdBy,referral.usedBy]
                User.findOneAndUpdate({_id:{$in:arr}},{cupidCoins:{$in:referral.ammount}},{ useFindAndModify: false }).then(()=>{
                    res.send(referral);
                }).catch(err=>{
                    return next({
                        message: err || "unknown error",
                        status: 400
                    });
                })
            }).catch(err=>{
                // console.log(err);
                return next({
                    message: err || "unknown error",
                    status: 400
                });
            })
        }
        else{
            return next({
                status: 400,
                message: "Invalid Token"
            });
        }
    }).catch(err=>{
        // console.log(err);
        return next({
            message: err || "unknown error",
            status: 400
        });
    })
});
module.exports = router;
