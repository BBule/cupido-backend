const express = require("express");
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

const mycommits = require("../models/mycommits");
const myOrders = require("../models/myorders");

// API end point to route traffic of mycommits page, split into active and missed
// To check authenticate function, currently disabled.
// Also after login the route takes him to the exact same page
// Remember the commits are refrenced
router.get("/", (req, res) => {
    var commitholder;
    var curruser = req.user._id;
    var typeofcommit = req.query.type;
    console.log(req.originalUrl);
    if (typeofcommit == "active") {
        User.findOne({ _id: curruser, "mycommits.is_active": true })
            .then(result => {
                commitsholder = result.mycommits; // Array of commits of the current user
            })
            .then(() => {
                if (commitsholder == null || commitsholder.length == 0) {
                    console.log("No commits found");
                    return res.json([]);
                } else {
                    var startpoint = req.query.offset; // zero
                    var howmany = req.query.limit; // ten
                    console.log(
                        "commits is found and it's product marketprice: "
                    );
                    var commitfullholder = [];
                    // console.log(commitsholder[0].Product.marketPrice);
                    for (var i = 0; i < commitsholder.length; i++) {
                        mycommits
                            .findOne({
                                _id: commitholder[i],
                                is_active: true
                            })
                            .then(resultcommit => {
                                commitfullholder.push(resultcommit);
                            });
                    }
                    if (
                        commitfullholder == null ||
                        commitfullholder.length == 0
                    ) {
                        console.log("No commits found");
                        return res.json([]);
                    }
                    res.status(200).send(
                        commitfullholder.splice(startpoint, howmany)
                    );
                }
            })
            .catch(err => {
                next({ message: "Bad request", status: 400, stack: err });
            });
    } else {
        User.findOne({ _id: curruser, "mycommits.is_active": false })
            .then(result => {
                commitsholder = result.mycommits; // Array of carts of the current user
            })
            .then(() => {
                if (commitsholder == null || commitsholder.length == 0) {
                    console.log("No commits found");
                    return res.json([]);
                } else {
                    var startpoint = req.query.offset; // zero
                    var howmany = req.query.limit; // ten
                    console.log(
                        "commits is found and it's product marketprice: "
                    );
                    var commitfullholder = [];
                    // console.log(commitsholder[0].Product.marketPrice);
                    for (var i = 0; i < commitsholder.length; i++) {
                        mycommits
                            .findOne({
                                _id: commitholder[i],
                                is_active: false
                            })
                            .then(resultcommit => {
                                commitfullholder.push(resultcommit);
                            });
                    }
                    if (
                        commitfullholder == null ||
                        commitfullholder.length == 0
                    ) {
                        console.log("No commits found");
                        return res.json([]);
                    }
                    res.json(commitfullholder.splice(startpoint, howmany));
                }
            })
            .catch(err => {
                return next({
                    message: "Bad request",
                    status: 400,
                    stack: err
                });
            });
    }
});

router.post("/orderOrCommit", (req, res, next) => {
    const { wholeCart, addressId } = req.body;
    let promiseArr = [];
    wholeCart.forEach(element => {
        if (element.is_commit) {
            promiseArr.push(
                new mycommits({
                    ...element,
                    shipping_address: addressId
                }).save()
            );
        } else {
            //order
            promiseArr.push(
                new myOrders({
                    ...element,
                    shipping_address: addressId
                }).save()
            );
        }
    });

    return Promise.all(promiseArr)
        .then(data => {
            return res.json(data);
        })
        .catch(error => {
            return next({
                status: 400,
                message: "Unknown error occured!",
                stack: error
            });
        });
});
module.exports = router;
