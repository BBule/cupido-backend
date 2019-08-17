const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
var Request = require("request");

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
const Referral = require("../models/referral");
const cartCont = require("../controller/cart.cont");
const Products = require("../models/Products");
const myorders = require("../models/myorders");
const cupidLove = require("../models/CupidLove");

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// POST Route to send cart entry of an individual
// Create a new object and then embed data into the array
// User can send this route
router.post("/add", async (req, res, next) => {
    // console.log("Posting cart data to the DB");
    let curruser = req.user;
    mycartingeneral
        .findOne({ "sale.id": req.body.saleid, "User.id": curruser._id })
        .then(async item => {
            if (item) {
                return next({
                    message: "Item already present in cart.",
                    status: 400
                });
            } else {
                let newcartitem = new mycartingeneral({
                    "User.id": curruser._id,
                    "Product.id": req.body.productid,
                    "Product.name": req.body.productname,
                    "Product.salePrice": req.body.salePrice,
                    "sale.id": req.body.saleid,
                    timecreated: newIndDate(),
                    is_commit: req.body.is_commit,
                    cupidCoins: req.body.cupidCoins,
                    // referralAmount: req.body.referralAmount,
                    quantity: req.body.quantity,
                    total_expected_price:
                        req.body.salePrice * req.body.quantity -
                        req.body.cupidCoins * req.body.quantity,
                    size: req.body.size
                });

                // if (req.body.referral_code) {
                //     var token = await Referral.findOne({
                //         code: req.query.code,
                //         used: false,
                //         sale: req.query.sale,
                //         createdBy: { $ne: req.user._id }
                //     });
                //     if (token) {
                //         newcartitem.referral_code = req.body.referral_code;
                //         newcartitem.total_expected_price -= 50;
                //     } else {
                //         return next({
                //             status: 400,
                //             message: "Invalid Token"
                //         });
                //     }
                // }

                newcartitem
                    .save()
                    .then(async cartitem => {
                        return res.json({ msg: "Item added to cart" });
                        // await User.findOneAndUpdate(
                        //     { _id: curruser._id },
                        //     { $push: { mycarts: newcartitem } }
                        // )
                        //     .then(user => {
                        //         return res.json(user.mycarts);
                        //     })
                        //     .catch(err => {
                        //         console.log(err);
                        //         return next({
                        //             status: 400,
                        //             message: "unknown error while updating cart"
                        //         });
                        //     });
                    })
                    .catch(err => {
                        console.log(err);
                        return next({
                            status: 400,
                            message: "unknown error while updating cart"
                        });
                    });
            }
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
            console.log(error);
            return next({
                message: error.message || "Server Error",
                status: 500
            });
        });
});

// API end point to route traffic of mycarts page, split into commit and buy now
// To check authenticate function, currently disabled.
// Also after login the route takes him to the exact same page
// router.get("/", (req, res, next) => {
//     var curruser = req.user._id;
//     // var typeofcart = req.query.type;
//     // console.log(req.originalUrl);
//     let query = {
//         _id: curruser
//     };
//     if (req.query.type) {
//         query["mycarts.is_commit"] = req.query.type;
//     }
//     console.log(query)
// User.findOne(query)
//     .then(async result => {
//         if (result && result.mycarts && result.mycarts.length) {
//             var startpoint = req.query.offset || 0; // zero
//             var howmany = req.query.limit || 10; // ten
//             console.log("carts is found and it's product marketprice: ");
//             // console.log(result.mycarts[0].Product.marketPrice);
//             let cupidLove = null;
//             if (typeofcart == "commit") {
//                 cupidLove = await getEstimateCupidLove(cartsholder);
//             }
//             return res.json({
//                 cartsdata: result.mycarts.splice(startpoint, howmany)
//             });
//         } else {
//             return res.json({ cartsdata: [] });
//         }
//     })
//     .catch(err => {
//         return next({
//             message: err.message || "unknown error occured",
//             status: 400,
//             stack: err
//         });
//     });
// });

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

router.get("/view", (req, res, next) => {
    var cartsholder;
    var curruser = req.user;
    var typeofcart = req.query.type;
    // console.log(req.originalUrl);
    query = {
        "User.id": curruser._id
    };
    // if (typeofcart == "commit") {
    //     query["is_commit"] = true;
    // }
    // console.log(query);
    mycartingeneral
        .find(query)
        .populate("Product.id", "images")
        .then(async result => {
            if (result && result.length) {
                var itemsProcessed = 0;
                asyncForEach(result, async element => {
                    itemsProcessed++;
                    let referralList;
                    try {
                        referralList = await Referral.aggregate([
                            {
                                $match: {
                                    sale: element.sale.id,
                                    cart: req.user._id
                                }
                            },
                            {
                                $group: {
                                    _id: "$_id",
                                    amount: { $sum: "$amount" }
                                }
                            }
                        ]);
                    } catch (err) {
                        console.log(err);
                    }
                    element.referralList = referralList;
                    //if user is creator of referrals
                    if (referralList.length == 0) {
                        console.log("saleid", element.sale.id);
                        await Referral.findOne({
                            createdBy: req.user._id,
                            sale: element.sale.id
                        }).then(async referral => {
                            console.log(referral, "referral");
                            if (referral) {
                                referralList_sub = [
                                    {
                                        _id: referral._id,
                                        amount: referral.amount
                                    }
                                ];
                                element.referralList = referralList_sub;
                            } else {
                                referralList = [];
                                element.referralList = referralList;
                            }
                        });
                    }
                    console.log(itemsProcessed, result.length);
                    if (itemsProcessed == result.length) {
                        return res.send({ cartsdata: result });
                    }
                });
            } else {
                return res.json({ cartsdata: [] });
            }
        })
        .catch(err => {
            console.log(err);
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

        totalCupidLove += sale.cupidLove.cupidLove;
    });
    return totalCupidLove;
}

router.patch("/update/:cartId", (req, res, next) => {
    const cartId = req.params.cartId;
    mycartingeneral
        .updateOne(
            {
                _id: cartId
            },
            { $set: req.body },
            { new: false }
        )
        .exec()
        .then(cart => {
            return res.send(cart);
        })
        .catch(err => {
            console.log(err);
        });
});

router.get("/track/:orderId", (req, res, next) => {
    const orderId = req.params.orderId;
    myorders.findOne({ _id: orderId }).then(order => {
        Request.get(
            `https://app.shiprocket.in/v1/external/track/awb/${
                order.shipping_awb
            }`,
            (error, response, body) => {
                if (error) {
                    return console.dir(error);
                }
                console.dir(JSON.parse(body));
                res.send(JSON);
            }
        );
    });
});

module.exports = router;
