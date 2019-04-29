const express = require("express");
const mongoose = require("mongoose");
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

const mycartingeneral = require("../models/mycartingeneral");
const SalesList = require("../models/saleslist");

const cartCont = require("../controller/cart.cont");

// POST Route to send cart entry of an individual
// Create a new object and then embed data into the array
// User can send this route
router.post("/add", (req, res, next) => {
    console.log("Posting cart data to the DB");
    let curruser = req.user;
    let newcartitem = new mycartingeneral({
        user: curruser._id,
        "product.id": req.body.productid,
        "product.name": req.body.productname,
        "product.marketPrice": req.body.marketPrice,
        sale: req.body.saleid,
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
                { $push: { mycarts: newcartitem } }
            )
                .then(() => {
                    return res.json(newcartitem);
                })
                .catch(err => {
                    console.log(err);
                    return next({
                        status: 400,
                        message: "unknown error while updating cart"
                    });
                })
        )
        .catch(err => {
            console.log(err);
            return next({
                status: 400,
                message: "unknown error while updating cart"
            });
        });
});

router.post("/remove", (req, res, next) => {
    let cartitemId = req.body.cartitemId;

    return cartCont
        .removeFromCart(cartitemId, req.user._id)
        .then(data => {
            return res.send({ message: "Cart item removed successfully" });
        })
        .catch(error => {
            return next({
                message: error.message || "Server Error",
                status: 500
            });
        });
});

// API end point to route traffic of mycarts page, split into commit and buy now
// To check authenticate function, currently disabled.
// Also after login the route takes him to the exact same page
router.get("/", (req, res, next) => {
    var cartsholder;
    var curruser = req.user._id;
    var typeofcart = req.query.type;
    console.log(req.originalUrl);
    let query = {
        _id: curruser,
        mycarts: {
            is_commit: false
        }
    };
    if (typeofcart == "commit") {
        query.mycarts.is_commit = true;
    }
    User.findOne(query)
        .then(async result => {
            if (result && result.mycarts && result.mycarts.length) {
                var startpoint = req.query.offset || 0; // zero
                var howmany = req.query.limit || 10; // ten
                console.log("carts is found and it's product marketprice: ");
                console.log(result.mycarts[0].Product.marketPrice);
                let cupidLove = null;
                if (typeofcart == "commit") {
                    cupidLove = await getEstimateCupidLove(cartsholder);
                }
                res.status(200).send({
                    cartsdata: result.mycarts.splice(startpoint, howmany)
                });
            } else {
                return res.json({ message: "No items found" });
            }
        })
        .catch(err => {
            return next({
                message: err.message || "unknown error occured",
                status: 400,
                stack: err
            });
        });
});

async function getEstimateCupidLove(cart) {
    let totalCupidLove = 0;
    cart.forEach(async function(item) {
        let saleid = cart.Sale.id;
        let sale = await SalesList.findById(saleid);
        let quantitySold = sale.quantity_sold + 1;
        for (i = 0; i < sale.cupidLove.length; i++) {
            if (quantitySold <= sale.cupidLove[i].quantity) {
                totalCupidLove += sale.cupidLove[i].cupidLove;
            }
        }
    });
    return totalCupidLove;
}

module.exports = router;
