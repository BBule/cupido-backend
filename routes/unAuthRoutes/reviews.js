const express = require("express");
const router = express.Router();
const lodash = require("lodash");

const reviews=require("../../models/reviews");
const products=require("../../models/Products");

router.get("/get/:productId",(req,res,next)=>{
    const ProductId=req.params.productId;
    reviews.find({"Product.id":ProductId}).then(reviews=>{
        return res.status(200).send(reviews);
    }).catch(error=>{
        return next({
            message: error.message || "Unknown error",
            status: 400,
            stack: error
        });
    })
})

module.exports=router;