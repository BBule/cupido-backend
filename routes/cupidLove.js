const express = require("express");
const router = express.Router();
const cupidLove = require("../models/CupidLove.js");

router.get("/mywallet",async (req,res,next)=>{
    let earnedSum
    try{earnedSum = await cupidLove.aggregate([
        {
            $match: {
                earned: true
            }
        },
        { $group: { _id: null, sum: { $sum: "$amount" } } }
    ]);}catch(err){
        console.log(err);
    }

    let redeemedSum
    try{
        redeemedSum=await cupidLove.aggregate([
            {
                $match: {
                    earned: false
                }
            },
            { $group: { _id: null, sum: { $sum: "$amount" } } }
        ]);
    }catch(err){
        console.log(err);
    }

    let cupidLoves;
    try{
        cupidLoves=await cupidLove.find({"User.id":req.user._id},{amount:1,earned:1,balance:1,source:1,timecreated:1})
    }catch(err){
        console.log(err);
    }
    res.json({"earnedSum":earnedSum[0].sum,"redeemedSum":redeemedSum[0].sum,"cupidLoves":cupidLoves,"currentBalance":earnedSum[0].sum-redeemedSum[0].sum})

})

module.exports = router;