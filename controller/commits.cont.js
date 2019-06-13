const cartCont = require("./cart.cont");
const mycommits = require("../models/mycommits");
const myOrders = require("../models/myorders");
const Saleslist = require("../models/saleslist");
const cart = require("../models/mycartingeneral.js");

const getUserCommits = async (
    userId,
    activeStat = true,
    limit = 100,
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
    limit = 100,
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

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
const getCommitCountBySale = async id => {
    return mycommits.countDocuments({ "sale.id": id }).exec();
};
const getOrderCountBySale = async id => {
    return myOrders.countDocuments({ "sale.id": id }).exec();
};
const waitFor = ms => new Promise(r => setTimeout(r, ms));

// const createCommitOrOrder = async (wholeCart, addressId, payment, userId) => {
//     // console.log(wholeCart);
//     let promiseArr = [];
//     await asyncForEach(wholeCart, async element => {
//         await waitFor(50);
//         let commit_count = await getCommitCountBySale(element.sale.id);
//         console.log(commit_count);
//         let sale = await Saleslist.findById(element.sale.id);
//         console.log(sale.cupidLove.quantity);
//         if (element.is_commit && commit_count < sale.cupidLove.quantity) {
//             promiseArr.push(
//                 new mycommits({
//                     ...element,
//                     shipping_address: addressId,
//                     payment_details: payment
//                 }).save()
//             );
//             // Saleslist.findOneAndUpdate({_id:element.sale.id},{$inc: {quantity_committed:element.current_quantity_committed}});
//         } else if (
//             element.is_commit &&
//             commit_count >= sale.cupidLove.quantity
//         ) {
//             promiseArr.push(
//                 new myOrders({
//                     ...element,
//                     shipping_address: addressId,
//                     payment_details: payment
//                 }).save()
//             );
//             let commits = await mycommits.find({ "sale.id": element.sale.id });
//             commits.forEach(function(commit) {
//                 promiseArr.push(mycommits.findByIdAndRemove(commit._id));
//                 delete commit._id;
//                 promiseArr.push(new myOrders(commit).save());
//                 // Saleslist.findOneAndUpdate({_id:element.sale.id},{$inc: {quantity_sold:element.current_quantity_committed}});
//             });
//         } else {
//             //order
//             promiseArr.push(
//                 new myOrders({
//                     ...element,
//                     shipping_address: addressId,
//                     payment_details: payment
//                 }).save()
//             );
//             // Saleslist.findOneAndUpdate({_id:element.sale.id},{$inc: {quantity_sold:element.current_quantity_committed}});
//         }
//         if (element.referral_code) {
//             promiseArr.push(
//                 Referral.findOneAndUpdate(
//                     { code: element.referral_code },
//                     { used: true, usedBy: userId }
//                 )
//             );
//             var referralBy = await Referral.findOne({
//                 code: element.referral_code
//             }).select("createdBy");
//             promiseArr.push(
//                 User.findByIdAndUpdate(referralBy, { $inc: { cupidCoins: 50 } })
//             );
//         }
//         promiseArr.push(cartCont.removeFromCart(wholeCart._id, userId));
//     });
//     return await Promise.all(promiseArr)
//         .then(data => {
//             return { success: true };
//         })
//         .catch(error => {
//             return Promise.reject(error);
//         });
// };

const createCommitOrOrder = async (wholeCart, addressId, payment, userId) => {
    const start=async ()=>{
        asyncForEach(wholeCart, async element => {
            let commit_count = await getCommitCountBySale(element.sale.id);
            let order_count = await getOrderCountBySale(element.sale.id);
            console.log(commit_count, order_count);
            let sale = await Saleslist.findById(element.sale.id);
            console.log(sale.cupidLove.quantity);
            if (element.is_commit && commit_count < sale.cupidLove.quantity) {
                commit1 = new mycommits({
                    "Product.id": element.Product.id,
                    "sale.id": element.sale.id,
                    "User.id": element.User.id,
                    shipping_address: addressId,
                    payment_details: payment
                });
                commit1
                    .save()
                    .then(async commit => {
                        await Saleslist.findOneAndUpdate(
                            { _id: element.sale.id },
                            {
                                $inc: {
                                    quantity_committed: 1
                                }
                            },
                            { useFindAndModify: false }
                        )
                            .then(async sale => {
                                // console.log("Hurrah!");
                            })
                            .catch(err => {
                                console.log(err);
                            });
                        // console.log("Hurray");
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else if (
                element.is_commit &&
                commit_count >= sale.cupidLove.quantity
            ) {
                order1 = new myOrders({
                    "Product.id": element.Product.id,
                    "sale.id": element.sale.id,
                    "User.id": element.User.id,
                    shipping_address: addressId,
                    payment_details: payment
                });
                order1
                    .save()
                    .then(async order => {
                        //from here if to increase 1 more quantity sold
                        await mycommits
                            .find({
                                "sale.id": element.sale.id
                            })
                            .then(commits => {
                                asyncForEach(commits, async commit => {
                                    await mycommits
                                        .findByIdAndRemove(commit._id)
                                        .then(() => {
                                            delete commit._id;
                                            order1 = new myOrders({
                                                "Product.id": commit.Product.id,
                                                "sale.id": commit.sale.id,
                                                "User.id": commit.User.id,
                                                shipping_address: addressId,
                                                payment_details: payment
                                            });
                                            // console.log(order1)
                                            // console.log(commit)
                                            order1
                                                .save()
                                                .then(async order => {
                                                    console.log("Orderinloopsaved");
                                                    await Saleslist.findOneAndUpdate(
                                                        { _id: element.sale.id },
                                                        {
                                                            $inc: {
                                                                quantity_sold: 1
                                                            }
                                                        },
                                                        { useFindAndModify: false }
                                                    )
                                                        .then(async sale => {
                                                            console.log("Hurray1");
                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        });
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                });
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                                    console.log("Hurray2");
                                });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                        console.log("Hurray3");
                    })
                    .catch(err => {
                        console.log(err);
                    }); //till here
            } else {
                order1 = new myOrders({
                    "Product.id": element.Product.id,
                    "sale.id": element.sale.id,
                    "User.id": element.User.id,
                    shipping_address: addressId,
                    payment_details: payment
                });
                order1.save().then(async order => {
                    Saleslist.findOneAndUpdate(
                        { _id: element.sale.id },
                        { $inc: { quantity_sold: 1 } },
                        { useFindAndModify: false }
                    ).then(sale=>{
                        console.log("OrderPlaced")
                    }).catch(err => {
                        console.log(err);
                    });;
                }).catch(err => {
                    console.log(err);
                });
            }
        });
        console.log("Finished")
    }
    start().then(()=>{
        return { success: true };
    }).catch(error=>{
        return Promise.reject(error);
    });
};

module.exports = {
    createCommitOrOrder,
    getUserCommits,
    getUserOrders,
    getCommitCountBySale
};
