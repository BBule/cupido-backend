const express = require("express");
const router = express.Router();
const jwt=require('jsonwebtoken');
const randomize = require('randomatic');
var mongoose = require('mongoose');

const Referral=require("../models/referral");

// router.get("/send", async (req, res, next) => {
//     var tokens=await Referral.find().select('code').then(async referral=>{
//         var token = randomize('Aa0', 5,{exclude:tokens});
//         var referral=new Referral({code:token,createdBy:req.user._id,sale:req.query.sale,used:false});//add amount
//         await referral.save().then(referral=>{

//         })
//     })
//     // res.send({code:referral.code});
// });
router.get("/apply", async (req, res, next) => { 
    var token=await Referral.findOne({code:req.query.code,used:false,sale:req.query.sale,createdBy: { $ne: req.user._id }});
    if(token){ //return amount from referral and update used=true
        return res.send({message:'verified',amount:50});
    }   
    else{
        return next({
            status: 400,
            message: "Invalid Token"
        });
    }
});
module.exports = router;
