const express = require("express");
const router = express.Router();

// Helper Functions
function newIndDate() {
    var nDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta"
    });
    return nDate;
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send("Login required");
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

// POST Route to add address of an individual to the DB
// Create a new object and then embed data into the array
// User can send this route
router.post("/addaddress", isLoggedIn, (req, res) => {
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
router.post("/addcomment", isLoggedIn, (req, res) => {
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
        .then(() =>
            Products.findOneAndUpdate(
                { _id: req.body.productid },
                { $push: { linkedcomments: newcomment } }
            )
                .then(() => {
                    console.log(
                        "Comment was pushed, though it shouldn't be visible yet."
                    );
                })
                .catch(err => {
                    res.status(400).send("Bad request");
                })
        )
        .catch(err => {
            res.status(400).send("Bad request 2");
        });
});

// POST Route to send cart entry of an individual
// Create a new object and then embed data into the array
// User can send this route
router.post("/addtocart", isLoggedIn, (req, res) => {
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
