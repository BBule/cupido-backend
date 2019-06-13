const cartCont = require("./cart.cont");
const mycommits = require("../models/mycommits");
const myOrders = require("../models/myorders");
const Saleslist = require("../models/saleslist");
const cart = require("../models/mycartingeneral.js");

const getUserCommits = async (
    userId,
    activeStat = true,
    limit = 20,
    skip = 0
) => {
    return await mycommits
        .find({
            "User.id": userId,
            is_active: activeStat
        })
        .limit(limit)
        .skip(skip)
        .exec();
};

const getUserOrders = async (
    userId,
    activeStat = true,
    limit = 20,
    skip = 0
) => {
    return await myOrders
        .find({
            "User.id": userId
        })
        .limit(limit)
        .skip(skip)
        .exec();
};

const getCommitCountBySale = async id => {
    return mycommits.countDocuments({ "sale.id": id }).exec();
};

// const getCupidQuantity=(async (cupidLove)=>{
//     var count=0;
//     cupidLove.forEach(item=>{
//         count+=item.quantity;
//     });
//     return count;
// })

const createCommitOrOrder = async (wholeCart, addressId, payment, userId) => {
    let promiseArr = [];
    wholeCart.forEach(async element => {
        let commit_count = await getCommitCountBySale(element.sale.id);
        let sale = await Saleslist.findById(element.sale.id);
        if (element.is_commit && commit_count < sale.cupidLove.quantity) {
            promiseArr.push(
                new mycommits({
                    ...element,
                    shipping_address: addressId,
                    payment_details: payment
                }).save()
            );
            Saleslist.findOneAndUpdate({_id:element.sale.id},{$inc: {quantity_committed:element.current_quantity_committed}});
        } else if (
            element.is_commit &&
            commit_count >= sale.cupidLove.quantity
        ) {
            promiseArr.push(
                new myOrders({
                    ...element,
                    shipping_address: addressId,
                    payment_details: payment
                }).save()
            );
            let commits = await mycommits.find({ "sale.id": element.sale.id });
            commits.forEach(function(commit) {
                promiseArr.push(mycommits.findByIdAndRemove(commit._id));
                delete commit._id;
                promiseArr.push(new myOrders(commit).save());
                Saleslist.findOneAndUpdate({_id:element.sale.id},{$inc: {quantity_sold:element.current_quantity_committed}});
            });
        } else {
            //order
            promiseArr.push(
                new myOrders({
                    ...element,
                    shipping_address: addressId,
                    payment_details: payment
                }).save()
            );
            Saleslist.findOneAndUpdate({_id:element.sale.id},{$inc: {quantity_sold:element.current_quantity_committed}});
        }
        if (element.referral_code) {
            promiseArr.push(
                Referral.findOneAndUpdate(
                    { code: element.referral_code },
                    { used: true, usedBy: userId }
                )
            );
            var referralBy = await Referral.findOne({
                code: element.referral_code
            }).select("createdBy");
            promiseArr.push(
                User.findByIdAndUpdate(referralBy, { $inc: { cupidCoins: 50 } })
            );
        }
        promiseArr.push(cartCont.removeFromCart(wholeCart._id, userId));
    });

    // wholeCart.forEach(async element => {
    //     let commit_count = await getCommitCountBySale(element.sale.id);
    //     let sale = await Saleslist.findById(element.sale.id);
    //     if (element.is_commit && commit_count < sale.cupidLove.quantity) {
    //         var commit1 = new mycommits({
    //             ...element,
    //             shipping_address: addressId,
    //             payment_details: payment
    //         });
    //         promiseArr.push(commit1.save());
    //         // Saleslist.findOneAndUpdate({_id:element.sale.id},{$inc: {quantity_committed:element.current_quantity_committed}});
    //     } else if (
    //         element.is_commit &&
    //         commit_count >= sale.cupidLove.quantity
    //     ) {
    //         var order1 = new myOrders({
    //             ...element,
    //             shipping_address: addressId,
    //             payment_details: payment
    //         });
    //         promiseArr.push(order1.save());
    //         let commits = await mycommits.find({ "sale.id": element.sale.id });
    //         commits.forEach(function(commit) {
    //             promiseArr.push(mycommits.findByIdAndRemove(commit._id));
    //             delete commit._id;
    //             var order2 = new myOrders(commit);
    //             promiseArr.push(order2.save());
    //             // Saleslist.findOneAndUpdate({_id:element.sale.id},{$inc: {quantity_sold:element.current_quantity_committed}});
    //         });
    //     } else {
    //         //order
    //         var order1 = new myOrders({
    //             ...element,
    //             shipping_address: addressId,
    //             payment_details: payment
    //         });
    //         promiseArr.push(order1.save());
    //         // Saleslist.findOneAndUpdate({_id:element.sale.id},{$inc: {quantity_sold:element.current_quantity_committed}});
    //     }
    // });
    // wholeCart.forEach(
    //     async element => {
    //         let commit_count = await getCommitCountBySale(element.sale.id);
    //         console.log(commit_count);
    //         Saleslist.findOne({ _id: element.sale.id }).then(async sale => {
    //             if (
    //                 element.is_commit &&
    //                 commit_count < sale.cupidLove.quantity
    //             ) {
    //                 await new mycommits({
    //                     ...element,
    //                     shipping_address: addressId,
    //                     payment_details: payment
    //                 })
    //                     .save()
    //                     .then(async (err, result) => {
    //                         if (err) {
    //                             console.log(err);
    //                         }
    //                         await Saleslist.findOneAndUpdate(
    //                             { _id: element.sale.id },
    //                             {
    //                                 $inc: {
    //                                     quantity_committed:
    //                                         element.current_quantity_committed
    //                                 }
    //                             }
    //                         );
    //                     });
    //             } else if (element.is_commit && commit_count >= Cupidcount) {
    //                 await new myOrders({
    //                     ...element,
    //                     shipping_address: addressId,
    //                     payment_details: payment
    //                 })
    //                     .save()
    //                     .then(async (err, result) => {
    //                         if (err) {
    //                             console.log(err);
    //                         }
    //                         let commits = await mycommits.find({
    //                             "sale.id": element.sale.id
    //                         });
    //                         commits.forEach(async function(commit) {
    //                             await mycommits.findByIdAndRemove(commit._id);
    //                             delete commit._id;
    //                             await new myOrders(commit).save();
    //                             await Saleslist.findOneAndUpdate(
    //                                 { _id: element.sale.id },
    //                                 {
    //                                     $inc: {
    //                                         quantity_sold:
    //                                             element.current_quantity_committed
    //                                     }
    //                                 }
    //                             );
    //                         });
    //                     });
    //             } else {
    //                 await new myOrders({
    //                     ...element,
    //                     shipping_address: addressId,
    //                     payment_details: payment
    //                 })
    //                     .save()
    //                     .then(async (err, result) => {
    //                         if (err) {
    //                             console.log(err);
    //                         }
    //                         await Saleslist.findOneAndUpdate(
    //                             { _id: element.sale.id },
    //                             {
    //                                 $inc: {
    //                                     quantity_sold:
    //                                         element.current_quantity_committed
    //                                 }
    //                             }
    //                         );
    //                     });
    //             }
    //         });
    //     },
    //     err => {
    //         console.log(err);
    //     }
    // );
    return Promise.all(promiseArr)
    .then(data => {
        return { success: true };
    })
    .catch(error => {
        return Promise.reject(error);
    });
};

module.exports = {
    createCommitOrOrder,
    getUserCommits,
    getUserOrders,
    getCommitCountBySale
};
