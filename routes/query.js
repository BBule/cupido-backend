const express = require("express");
const router = express.Router();

const query=require("../models/query.js");

router.post("/",(req,res,next)=>{
    const query1=new query({
        body:req.body.body,
        createdBy:req.user._id
    });
    query1.save().then(query=>{
        return res.send(query);
    })
    .catch(err=>{
        return next({
            status: 400,
            message: "No sale found",
            stack: err
        });
    });
});

module.exports = router;
