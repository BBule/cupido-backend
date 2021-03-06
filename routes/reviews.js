const express = require("express");
const router = express.Router();
const lodash = require("lodash");
const mongoose = require("mongoose");

const reviews = require("../models/reviews");
const products = require("../models/Products");
const myorders = require("../models/myorders");

function newIndDate() {
    var nDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta"
    });
    return nDate;
}

router.post("/add/:productId", async (req, res, next) => {
    let curruser = req.user;
    var checkbuy = false;

    await myorders
        .findOne({
            "Product.id": req.params.productId,
            "User.id": curruser._id
        })
        .then(myorder => {
            if (myorder) {
                checkbuy = true;
            }
            console.log(checkbuy);
            let newreview = new reviews({
                "User.id": curruser._id,
                "Product.id": req.params.productId,
                timecreated: newIndDate(),
                rating: req.body.rating,
                reviewbody: req.body.reviewbody,
                is_verified_buyer: checkbuy
            });
            newreview
                .save()
                .then(async review => {
                    // console.log(review);
                    await reviews
                        .aggregate([
                            {
                                $match: {
                                    "Product.id": mongoose.Types.ObjectId(
                                        req.params.productId
                                    )
                                }
                            },
                            { $group: { _id: null, avg: { $avg: "$rating" } } }
                        ])
                        .then(async result => {
                            // console.log(result[0].avg);
                            var navrg_rating=result[0].avg;
                            await products
                                .findOneAndUpdate(
                                    { _id: req.params.productId },
                                    { avrg_rating: navrg_rating },
                                    {
                                        useFindAndModify: false
                                    }
                                )
                                .then(product => {
                                    res.send(newreview);
                                });
                        })
                        .catch(err => {
                            return next({
                                message: "Bad request",
                                status: 400,
                                stack: err
                            });
                            // console.log(err)
                        });
                })
                .catch(err => {
                    return next({
                        message: "Bad request",
                        status: 400,
                        stack: err
                    });
                    // console.log(err);
                });
        })
        .catch(err => {
            return next({ message: "Bad request", status: 400, stack: err });
            // console.log(err)
        });
});

module.exports = router;
