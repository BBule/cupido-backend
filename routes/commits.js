const express = require("express");
const router = express.Router();
const myorders = require("../models/myorders.js");
const mycommits = require("../models/mycommits.js");
const Saleslist = require("../models/saleslist.js");

const {
    createCommitOrOrder,
    getUserCommits,
    getUserOrders
} = require("../controller/commits.cont");

router.get("/mycommits", (req, res, next) => {
    // console.log("Hello")
    const { type = true, skip = 0, limit = 10 } = req.query;
    return getUserCommits(req.user._id, type, limit, skip)
        .then(data => {
            return res.json(data);
        })
        .catch(error => {
            console.log(error);
            return next({
                stack: error,
                message: "unknown error occured",
                status: 400
            });
        });
});

router.get("/myorders", (req, res, next) => {
    const { type = true, skip = 0, limit = 10 } = req.query;
    return getUserOrders(req.user._id, limit, skip)
        .then(data => {
            return res.json(data);
        })
        .catch(error => {
            console.log(error);
            return next({
                stack: error,
                message: "unknown error occured",
                status: 400
            });
        });
});

router.post("/orderOrCommit", async (req, res, next) => {
    if (req.body.payment) {
        const { wholeCart, addressId, payment, cash } = req.body;
        if (!wholeCart || !wholeCart.length) {
            return next({
                status: 400,
                message: "please pass all the cart item"
            });
        }
        await createCommitOrOrder(
            wholeCart,
            addressId,
            payment,
            req.user._id,
            cash
        )
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return next({
                    status: 400,
                    message: "Unknown error occured!",
                    stack: error
                });
            });
    } else {
        return next({
            status: 400,
            message: "please complete your payment"
        });
    }
});

module.exports = router;
