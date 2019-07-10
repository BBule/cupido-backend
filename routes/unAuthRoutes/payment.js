const express = require("express");
const router = express.Router();
const lodash = require("lodash");

const config = require("../../config/config");

router.get("/key-code",(req,res,next)=>{
    return res.send({"key_id":config.RAZOR_PAY.key_id,"key_secret":config.RAZOR_PAY.key_secret})
})

module.exports=router;