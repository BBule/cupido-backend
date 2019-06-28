const express = require("express");
const router = express.Router();
const lodash = require("lodash");

const faq=require("../../models/faq");

router.get("/faqs",(req,res,next)=>{
    faq.find({category:req.params.query}).then(async faqs=>{
        return res.send(faqs);
    }).catch(err=>{
        console.log(err);
        return next({
            message: err.message ||"Faqs not found",
            status: 400,
            stack: err
        });
    })
})

module.exports=router;