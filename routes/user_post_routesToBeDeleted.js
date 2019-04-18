const express = require("express");
const authenticate = require(".././middleware/authenticate");
const router = express.Router();

// Helper Functions
function newIndDate() {
    var nDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta"
    });
    return nDate;
}

// Models
const User = require("../models/user");
const Products = require("../models/Products");
const Saleslist = require("../models/saleslist");
const mycartingeneral = require("../models/mycartingeneral");
const mygifts = require("../models/mygifts");
const mycomments = require("../models/mycomments");
const mycommits = require("../models/mycommits");
const myaddresses = require("../models/myaddresses");
// const allinventory = require('../models/allinventory');
const myorders = require("../models/myorders");
const categorylist = require("../models/categorylist");
const myreplies = require("../models/myreplies");
// POST Route to add address of an individual to the DB
// Create a new object and then embed data into the array
// User can send this route
router.post("/addaddress", authenticate, (req, res) => {
    console.log("Posting address to the user");
    let curruser = req.user;
    // All properties to be input from user
    // Nothing except ID of user from tech logics.
    let newaddress = new myaddresses({
        "User.id": curruser._id,
        "User.username": req.body.username,
        "User.useremail": req.body.useremail,
        "User.contact": req.body.contact,
        "User.address": req.body.address,
        "User.landmark": req.body.landmark,
        "User.city": req.body.city,
        "User.state": req.body.state,
        "User.country": req.body.country,
        timecreated: newIndDate()
    });
    newaddress
        .save()
        .then(() =>
            User.findOneAndUpdate(
                { _id: curruser._id },
                { $push: { myaddresses: newaddress } }
            )
                .then(() => {
                    console.log("Address was pushed");
                })
                .catch(err => {
                    res.status(400).send("Bad request");
                })
        )
        .catch(err => {
            res.status(400).send("Bad request 2");
        });
});

// POST Route to send comment entry of an individual to the admin discretion portal
// Create a new object and then embed data into the array
// User can send this route
router.post("/addcomment", authenticate, (req, res) => {
    console.log("Posting comment to the admin discretion portal");
    let curruser = req.user;
    // All properties to be input from user
    // Nothing except ID of user from tech logics.
    let checkbuy = false;
    // Will be true if myorders in user will be found.
    User.findOne({ _id: curruser._id }).then(result => {
        var found = result.myorders.some(function(el) {
            return el.Product.id === req.body.productid;
        });
        if (found) {
            checkbuy = true;
        }
    });
    let newcomment = new mycomments({
        "User.id": curruser._id,
        "Product.id": req.body.productid,
        "Product.name": req.body.productname,
        "Product.rating": req.body.productrating,
        timecreated: newIndDate(),
        is_review: true,
        is_published: false,
        commentbody: req.body.commentbody,
        is_verified_buyer: checkbuy
    });
    newcomment
        .save()
        .then(() => res.send({ message: "Comment sent for review" }))
        .catch(err => {
            res.status(400).send("Bad request 2");
        });
});

router.post("/comment/upvote", authenticate, async function(req, res) {
    let curruser = req.user;
    try{
        var commentUpvoted= await mycomments.findOne({_id:req.body.commentid,'upvotes.meta':curruser._id});
        var commentDownvoted= await mycomments.findOne({_id:req.body.commentid,'downvotes.meta':curruser._id});
        console.log(commentUpvoted);
        console.log(commentDownvoted);
        if(commentUpvoted){
            var comment=await mycomments.findOneAndUpdate(
                {_id:req.body.commentid},
                {$pull:{'upvotes.meta':curruser._id},
                $inc:{'upvotes.count':-1}},
                {new:true});
            res.send({upvotes:comment.upvotes.count,downvotes:comment.downvotes.count,user_upvoted:false,user_downvoted:false});
        }
        else if(commentDownvoted){
            var comment=await mycomments.findOneAndUpdate(
                {_id:req.body.commentid},
                {$pull:{'downvotes.meta':curruser._id},
                $push:{'upvotes.meta':curruser._id},
                $inc:{'upvotes.count':1,'downvotes.count':-1}},
                {new:true});
            res.send({upvotes:comment.upvotes.count,downvotes:comment.downvotes.count,user_upvoted:true,user_downvoted:false});
        }
        else{

            var comment=await mycomments.findOneAndUpdate(
                {_id:req.body.commentid},
                {$push:{'upvotes.meta':curruser._id},
                    $inc:{'upvotes.count':1}},
                    {new:true});
            res.send({upvotes:comment.upvotes.count,downvotes:comment.downvotes.count,user_upvoted:true,user_downvoted:false});

        }
    }
    catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

router.post("/product/like", authenticate, async function(req, res) {
     let curruser = req.user;
    try{
        var ProductLiked= await Products.findOne({_id:req.body.productid,'likedlist.meta':curruser._id});
        if(ProductLiked){
            var product=await Products.findOneAndUpdate(
                {_id:req.body.productid},
                {$pull:{'likedlist.meta':curruser._id},
                $inc:{'likedlist.count':-1}},
                {new:true});
            res.send({likes:product.likedlist.count,user_liked:false});
        }
        else{

            var product=await Products.findOneAndUpdate(
                {_id:req.body.productid},
                {$push:{'likedlist.meta':curruser._id},
                $inc:{'likedlist.count':1}},
                {new:true});
            res.send({likes:product.likedlist.count,user_liked:true});

        }
    }
    catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

router.post("/comment/downvote", authenticate, async function(req, res) {
     let curruser = req.user;
    try{
        var commentUpvoted= await mycomments.findOne({_id:req.body.commentid,'upvotes.meta':curruser._id});
        var commentDownvoted= await mycomments.findOne({_id:req.body.commentid,'downvotes.meta':curruser._id});
        if(commentDownvoted){
            var comment=await mycomments.findOneAndUpdate(
                {_id:req.body.commentid},
                {$pull:{'downvotes.meta':curruser._id},
                $inc:{'downvotes.count':-1}},
                {new:true});
            res.send({upvotes:comment.upvotes.count,downvotes:comment.downvotes.count,user_upvoted:false,user_downvoted:false});
        }
        else if(commentUpvoted){
            var comment=await mycomments.findOneAndUpdate(
                {_id:req.body.commentid},
                {$pull:{'upvotes.meta':curruser._id},
                $push:{'downvotes.meta':curruser._id},
                $inc:{'downvotes.count':1,'upvotes.count':-1}},
                {new:true});
            res.send({upvotes:comment.upvotes.count,downvotes:comment.downvotes.count,user_upvoted:false,user_downvoted:true});
        }
        else{

            var comment=await mycomments.findOneAndUpdate(
                {_id:req.body.commentid},
                {$push:{'downvotes.meta':curruser._id},
                    $inc:{'downvotes.count':1}},
                    {new:true});
            res.send({upvotes:comment.upvotes.count,downvotes:comment.downvotes.count,user_upvoted:false,user_downvoted:true});

        }
    }
    catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

router.post("/addreply", authenticate, async (req, res) => {
    console.log("Posting reply to the admin discretion portal");
    let curruser = req.user;
    // All properties to be input from user
    // Nothing except ID of user from tech logics.
    try {
        let comment = await mycomments.findOne({ _id: req.body.commentid });
        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }
        let checkbuy = false;
        // Will be true if myorders in user will be found.
        var found = curruser.myorders.some(function(el) {
            return el.Product.id === comment.Product.id;
        });
        if (found) {
            checkbuy = true;
        }

        let newreply = new myreplies({
            "User.id": curruser._id,
            "Comment.id": req.body.commentid,
            timecreated: newIndDate(),
            is_review: true,
            is_published: false,
            replybody: req.body.replybody,
            is_verified_buyer: checkbuy
        });

        var reply = await newreply.save();

        res.send({ message: "Reply sent for review" });
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

// POST Route to send cart entry of an individual
// Create a new object and then embed data into the array
// User can send this route
router.post("/addtocart", authenticate, (req, res) => {
    console.log("Posting cart data to the DB");
    let curruser = req.user;
    let newcartitem = new mycartingeneral({
        "User.id": curruser._id,
        "Product.id": req.body.productid,
        "Product.name": req.body.productname,
        "Product.marketPrice": req.body.marketPrice,
        "sale.id": req.body.saleid,
        timecreated: newIndDate(),
        is_commit: req.body.iscommit,
        price_committed_at: req.body.price_committed_at,
        quantity: req.body.quantity,
        total_expected_price: req.body.price_committed_at * req.body.quantity
    });
    newcartitem
        .save()
        .then(() =>
            User.findOneAndUpdate(
                { _id: curruser._id },
                { $push: { mycartingeneral: newcartitem } }
            )
                .then(() => {
                    console.log("Cart item was pushed.");
                })
                .catch(err => {
                    res.status(400).send("Bad request");
                })
        )
        .catch(err => {
            res.status(400).send("Bad request 2");
        });
});

// Note:
// mygifts are created when sale ends
// myorders and mycommits are created when payment portal sends ack
// mynotifications are created in various scenarios.
// We have to stop user from making such POST routes, using CORS may be.

module.exports = router;
