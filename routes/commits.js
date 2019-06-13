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
    return getUserOrders(req.user._id, type, limit, skip)
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

router.post("/orderOrCommit", (req, res, next) => {
    if (req.body.payment.id) {
        const { wholeCart, addressId, payment } = req.body;
        if (!wholeCart || !wholeCart.length) {
            return next({
                status: 400,
                message: "please pass all the cart item"
            });
        }
        // let promiseArr = [];
        // wholeCart.forEach(async element => {
        //     let commit_count = await getCommitCountBySale(element.sale.id);
        //     let sale = await Saleslist.findById(element.sale.id);
        //     if (element.is_commit && commit_count < sale.cupidLove.quantity) {
        //         promiseArr.push(
        //             await new mycommits({
        //                 ...element,
        //                 shipping_address: addressId,
        //                 payment_details: payment
        //             }).save()
        //         );
        //         await Saleslist.findOneAndUpdate(
        //             { _id: element.sale.id },
        //             {
        //                 $inc: {
        //                     quantity_committed:
        //                         element.current_quantity_committed
        //                 }
        //             }
        //         );
        //     } else if (
        //         element.is_commit &&
        //         commit_count >= sale.cupidLove.quantity
        //     ) {
        //         promiseArr.push(
        //             await new myorders({
        //                 ...element,
        //                 shipping_address: addressId,
        //                 payment_details: payment
        //             }).save()
        //         );
        //         let commits = await mycommits.find({
        //             "sale.id": element.sale.id
        //         });
        //         commits.forEach(async function(commit) {
        //             promiseArr.push(await mycommits.findByIdAndRemove(commit._id));
        //             delete commit._id;
        //             promiseArr.push( new myorders(commit).save());
        //             await Saleslist.findOneAndUpdate(
        //                 { _id: element.sale.id },
        //                 {
        //                     $inc: {
        //                         quantity_sold:
        //                             element.current_quantity_committed
        //                     }
        //                 }
        //             );
        //         });
        //     } else {
        //         //order
        //         promiseArr.push(
        //             await new myorders({
        //                 ...element,
        //                 shipping_address: addressId,
        //                 payment_details: payment
        //             }).save()
        //         );
        //         await Saleslist.findOneAndUpdate(
        //             { _id: element.sale.id },
        //             {
        //                 $inc: {
        //                     quantity_sold: element.current_quantity_committed
        //                 }
        //             }
        //         );
        //     }
        //     // if (element.referral_code) {
        //     //     promiseArr.push(
        //     //         Referral.findOneAndUpdate(
        //     //             { code: element.referral_code },
        //     //             { used: true, usedBy: userId }
        //     //         )
        //     //     );
        //     //     var referralBy = await Referral.findOne({
        //     //         code: element.referral_code
        //     //     }).select("createdBy");
        //     //     promiseArr.push(
        //     //         User.findByIdAndUpdate(referralBy, {
        //     //             $inc: { cupidCoins: 50 }
        //     //         })
        //     //     );
        //     // }
        //     // promiseArr.push(cartCont.removeFromCart(wholeCart._id, userId));
        // });
        // Promise.all(promiseArr)
        //     .then(result => {
        //         return res.status(200).send(result);
        //     })
        //     .catch(err => {
        //         return next({
        //             status: 400,
        //             message: "Unknown error occured!",
        //             stack: err
        //         });
        //     });
        createCommitOrOrder(wholeCart, addressId, payment, req.user._id)
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

// router.post("/exit", (req, res, next) => {
//     let promiseArr = [];
//     promiseArr.push(
//         new myorders({
//             ...req.body.wholeCart[0],
//             "User.id": req.user._id,
//             shipping_address: req.body.addressId,
//             payment_details: req.body.payment
//         }).save()
//     );
//     promiseArr.push(
//         new mycommits({
//             ...req.body.wholeCart[0],
//             "User.id": req.user._id,
//             shipping_address: req.body.addressId,
//             payment_details: req.body.payment
//         }).save()
//     );
//     Promise.all(promiseArr).then(() => {
//         res.status(200).json({ msg: "done" });
//     });
// });

module.exports = router;
