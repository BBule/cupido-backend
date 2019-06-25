const cartCont = require("./cart.cont");
const mycommits = require("../models/mycommits");
const myOrders = require("../models/myorders");
const cupidLove = require("../models/CupidLove");
const Saleslist = require("../models/saleslist");
const cart = require("../models/mycartingeneral.js");
const config = require("../config/config");

const Razorpay = require("razorpay");

const getUserCommits = async (
    userId,
    activeStat = true,
    limit = 10,
    skip = 0
) => {
    return await mycommits
        .find({
            "User.id": userId,
            is_active: activeStat
        })
        .populate("Product.id", "images")
        .populate("sale.id", "quantity_sold quantity_committed cupidLove")
        .populate("shipping_address")
        .limit(limit)
        .skip(skip)
        .exec();
};

const getUserOrders = async (userId, limit = 1000, skip = 0) => {
    return await myOrders
        .find(
            {
                "User.id": userId
            },
            {
                order_amount: 1,
                "sale.id": 1,
                timecreated: 1,
                shipping_awb: 1,
                order_status: 1
            }
        )
        .populate("Product.id", "images brandName title")
        .populate("shipping_address")
        .populate("sale.id", "salePrice")
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

var instance = new Razorpay({
    key_id: config.RAZOR_PAY.key_id,
    key_secret: config.RAZOR_PAY.key_secret
});

function checkandcapturePayments(pay_id, amount, cal_amount, status) {
    if (amount === cal_amount && status === "authorized") {
        instance.payments
            .capture(pay_id, amount * 100)
            .then(response => console.log("success"))
            .error(error => console.log(error));
    }
}

const createCommit = async (
    productId,
    saleId,
    userId,
    addressId,
    payment,
    amount
) => {
    commit1 = new mycommits({
        "Product.id": productId,
        "sale.id": saleId,
        "User.id": userId,
        shipping_address: addressId,
        payment_details: payment,
        commit_amount: amount
    });
    return commit1.save();
};

const createOrder = async (
    productId,
    saleId,
    userId,
    addressId,
    payment,
    orderStatus,
    amount
) => {
    commit1 = new mycommits({
        "Product.id": productId,
        "sale.id": saleId,
        "User.id": userId,
        shipping_address: addressId,
        payment_details: payment,
        order_amount: amount,
        order_status: orderStatus
    });
    return commit1.save();
};

const updateSale = async saleId => {
    return Saleslist.findOneAndUpdate(
        {
            _id: saleId
        },
        {
            $inc: {
                quantity_sold: await getOrderCountBySale(saleId)
            }
        },
        {
            useFindAndModify: false
        }
    );
};

// const createCommitOrOrder = async (
//     wholeCart,
//     addressId,
//     payment,
//     userId,
//     cash
// ) => {
//     var itemsProcessed = 0;
//     cal_amount = 0;
//     asyncForEach(wholeCart, async element => {
//         itemsProcessed++;
//         let commit_count = await getCommitCountBySale(element.sale.id);
//         let order_count = await getOrderCountBySale(element.sale.id);
//         console.log(commit_count, order_count);
//         let sale = await Saleslist.findById(element.sale.id);
//         cal_amount += sale.salePrice;
//         console.log(sale.cupidLove.quantity);
//         if (
//             element.is_commit &&
//             commit_count + order_count < sale.cupidLove.quantity
//         ) {
//             commit1 = new mycommits({
//                 "Product.id": element.Product.id,
//                 "sale.id": element.sale.id,
//                 "User.id": element.User.id,
//                 shipping_address: addressId,
//                 payment_details: payment,
//                 commit_amount: sale.salePrice - element.cupidCoins
//             });
//             commit1
//                 .save()
//                 .then(async commit => {
//                     await Saleslist.findOneAndUpdate(
//                         { _id: element.sale.id },
//                         {
//                             $inc: {
//                                 quantity_committed: await getCommitCountBySale(
//                                     element.sale.id
//                                 )
//                             }
//                         },
//                         { useFindAndModify: false }
//                     )
//                         .then(async sale => {
//                             // console.log("Hurrah!");
//                             if (itemsProcessed == wholeCart.length) {
//                                 console.log(
//                                     itemsProcessed,
//                                     wholeCart.length,
//                                     cal_amount
//                                 );
//                                 if (!cash) {
//                                     instance.payments
//                                         .fetch(payment.id)
//                                         .then(response =>
//                                             checkandcapturePayments(
//                                                 response.id,
//                                                 response.amount / 100,
//                                                 cal_amount,
//                                                 response.status
//                                             )
//                                         )
//                                         .catch(error => console.log(error));
//                                 }
//                                 await cart
//                                     .deleteMany({ "User.id": userId })
//                                     .then(() => {
//                                         // console.log("Deleted");
//                                     })
//                                     .catch(err => {
//                                         console.log(err);
//                                     });
//                             }
//                         })
//                         .catch(err => {
//                             console.log(err);
//                         });
//                     // console.log("Hurray");
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 });
//         } else if (
//             element.is_commit &&
//             commit_count + order_count >= sale.cupidLove.quantity
//         ) {
//             order1 = new myOrders({
//                 "Product.id": element.Product.id,
//                 "sale.id": element.sale.id,
//                 "User.id": element.User.id,
//                 shipping_address: addressId,
//                 payment_details: payment,
//                 order_status: "Processed",
//                 order_amount: sale.salePrice - element.cupidCoins
//             });
//             order1
//                 .save()
//                 .then(async order => {
//                     await Saleslist.findOneAndUpdate(
//                         {
//                             _id: element.sale.id
//                         },
//                         {
//                             $inc: {
//                                 quantity_sold: await getOrderCountBySale(
//                                     element.sale.id
//                                 )
//                             }
//                         },
//                         {
//                             useFindAndModify: false
//                         }
//                     )
//                         .then(async sale => {
//                             await mycommits
//                                 .find({
//                                     "sale.id": element.sale.id
//                                 })
//                                 .then(commits => {
//                                     asyncForEach(commits, async commit => {
//                                         await mycommits
//                                             .findByIdAndRemove(commit._id)
//                                             .then(() => {
//                                                 delete commit._id;
//                                                 // createOrder(
//                                                 //     commit.Product.id,
//                                                 //     commit.sale.id,
//                                                 //     commit.User.id,
//                                                 //     commit.shipping_address,
//                                                 //     commit.payment_details,
//                                                 //     "Processed",
//                                                 //     sale.salePrice -
//                                                 //         element.cupidCoins
//                                                 // )
//                                                 order1 = new myOrders({
//                                                     "Product.id":
//                                                         commit.Product.id,
//                                                     "sale.id": commit.sale.id,
//                                                     "User.id": commit.User.id,
//                                                     shipping_address:
//                                                         commit.shipping_address,
//                                                     payment_details:
//                                                         commit.payment_details,
//                                                     order_status: "Processed",
//                                                     order_amount:
//                                                         sale.salePrice -
//                                                         element.cupidCoins
//                                                 });
//                                                 // console.log(order1)
//                                                 // console.log(commit)
//                                                 order1
//                                                     .save()
//                                                     .then(async order => {
//                                                         // console.log("Orderinloopsaved");
//                                                         await Saleslist.findOneAndUpdate(
//                                                             {
//                                                                 _id:
//                                                                     element.sale
//                                                                         .id
//                                                             },
//                                                             {
//                                                                 $inc: {
//                                                                     quantity_sold: await getOrderCountBySale(
//                                                                         element
//                                                                             .sale
//                                                                             .id
//                                                                     )
//                                                                 }
//                                                             },
//                                                             {
//                                                                 useFindAndModify: false
//                                                             }
//                                                         )
//                                                             .then(
//                                                                 async sale => {
//                                                                     // console.log("Hurray1");
//                                                                     if (
//                                                                         itemsProcessed ===
//                                                                         wholeCart.length
//                                                                     ) {
//                                                                         console.log(
//                                                                             itemsProcessed,
//                                                                             wholeCart.length,
//                                                                             cal_amount
//                                                                         );
//                                                                         if (
//                                                                             !cash
//                                                                         ) {
//                                                                             instance.payments
//                                                                                 .fetch(
//                                                                                     payment.id
//                                                                                 )
//                                                                                 .then(
//                                                                                     response =>
//                                                                                         checkandcapturePayments(
//                                                                                             response.id,
//                                                                                             response.amount /
//                                                                                                 100,
//                                                                                             cal_amount,
//                                                                                             response.status
//                                                                                         )
//                                                                                 )
//                                                                                 .catch(
//                                                                                     error =>
//                                                                                         console.log(
//                                                                                             error
//                                                                                         )
//                                                                                 );
//                                                                         }
//                                                                         await cart
//                                                                             .deleteMany(
//                                                                                 {
//                                                                                     "User.id": userId
//                                                                                 }
//                                                                             )
//                                                                             .then(
//                                                                                 () => {
//                                                                                     // console.log("Deleted");
//                                                                                 }
//                                                                             )
//                                                                             .catch(
//                                                                                 err => {
//                                                                                     console.log(
//                                                                                         err
//                                                                                     );
//                                                                                 }
//                                                                             );
//                                                                     }
//                                                                 }
//                                                             )
//                                                             .catch(err => {
//                                                                 console.log(
//                                                                     err
//                                                                 );
//                                                             });
//                                                     })
//                                                     .catch(err => {
//                                                         console.log(err);
//                                                     });
//                                             })
//                                             .catch(err => {
//                                                 console.log(err);
//                                             });
//                                         // console.log("Hurray2");
//                                     });
//                                 })
//                                 .catch(err => {
//                                     console.log(err);
//                                 });
//                         })
//                         .catch(err => {
//                             console.log(err);
//                         });
//                     // console.log("Hurray3");
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 }); //till here
//         } else {
//             order1 = new myOrders({
//                 "Product.id": element.Product.id,
//                 "sale.id": element.sale.id,
//                 "User.id": element.User.id,
//                 shipping_address: addressId,
//                 payment_details: payment,
//                 order_status: "Processed",
//                 order_amount: sale.salePrice - element.cupidCoins
//             });
//             order1
//                 .save()
//                 .then(async order => {
//                     Saleslist.findOneAndUpdate(
//                         { _id: element.sale.id },
//                         {
//                             $inc: {
//                                 quantity_sold: await getOrderCountBySale(
//                                     element.sale.id
//                                 )
//                             }
//                         },
//                         { useFindAndModify: false }
//                     )
//                         .then(async sale => {
//                             // console.log("OrderPlaced");
//                             if (itemsProcessed == wholeCart.length) {
//                                 console.log(
//                                     itemsProcessed,
//                                     wholeCart.length,
//                                     cal_amount
//                                 );
//                                 if (!cash) {
//                                     instance.payments
//                                         .fetch(payment.id)
//                                         .then(response =>
//                                             checkandcapturePayments(
//                                                 response.id,
//                                                 response.amount / 100,
//                                                 cal_amount,
//                                                 response.status
//                                             )
//                                         )
//                                         .catch(error => console.log(error));
//                                 }
//                                 await cart
//                                     .deleteMany({ "User.id": userId })
//                                     .then(() => {
//                                         console.log("Deleted");
//                                     })
//                                     .catch(err => {
//                                         console.log(err);
//                                     });
//                             }
//                         })
//                         .catch(err => {
//                             console.log(err);
//                         });
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 });
//         }
//     });
//     console.log("Finished");
//     return { status: true };
// };

const createCupidLove = async (
    orderId,
    saleId,
    earned,
    UserId,
    isOrder,
    amount
) => {
    earnedSum = await cupidLove.aggregate([
        {
            $match: {
                earned: true
            }
        },
        { $group: { _id: null, sum: { $sum: "$amount" } } }
    ]);
    redeemedSum=await cupidLove.aggregate([
        {
            $match: {
                earned: false
            }
        },
        { $group: { _id: null, sum: { $sum: "$amount" } } }
    ]);
    cupidlove1 = new cupidLove({
        "Order.id": orderId,
        "Sale.id": saleId,
        earned: earned,
        "User.id": UserId,
        isOrder: isOrder,
        amount: amount,
        balance:earnedSum[0].sum-redeemedSum[0].sum+amount
    });
    cupidLove1.save();
};

const createCommitOrOrder = async (
    wholeCart,
    addressId,
    payment,
    userId,
    cash
) => {
    var itemsProcessed = 0;
    cal_amount = 0;
    asyncForEach(wholeCart, async element => {
        itemsProcessed++;
        let commit_count = await getCommitCountBySale(element.sale.id);
        let order_count = await getOrderCountBySale(element.sale.id);
        console.log(commit_count, order_count);
        let sale = await Saleslist.findById(element.sale.id);
        cal_amount += sale.salePrice;
        console.log(sale.cupidLove.quantity);
        if (
            element.is_commit &&
            commit_count + order_count < sale.cupidLove.quantity
        ) {
            createCommit(
                element.Product.id,
                element.sale.id,
                element.User.id,
                addressId,
                payment,
                sale.salePrice - element.cupidCoins
            )
                .then(async commit => {
                    updateSale(element.sale.id)
                        .then(async sale => {
                            if (itemsProcessed == wholeCart.length) {
                                if (!cash) {
                                    instance.payments
                                        .fetch(payment.id)
                                        .then(response =>
                                            checkandcapturePayments(
                                                response.id,
                                                response.amount / 100,
                                                cal_amount,
                                                response.status
                                            )
                                        )
                                        .catch(error => console.log(error));
                                }
                                await cart
                                    .deleteMany({ "User.id": userId })
                                    .then(() => {
                                        // console.log("Deleted");
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        } else if (
            element.is_commit &&
            commit_count + order_count >= sale.cupidLove.quantity
        ) {
            createOrder(
                element.Product.id,
                element.sale.id,
                element.User.id,
                addressId,
                payment,
                "Processed",
                sale.salePrice - element.cupidCoins
            )
                .then(async order => {
                    updateSale(element.sale.id)
                        .then(async sale => {
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
                                                createOrder(
                                                    commit.Product.id,
                                                    commit.sale.id,
                                                    commit.User.id,
                                                    commit.shipping_address,
                                                    commit.payment_details,
                                                    "Processed",
                                                    sale.salePrice -
                                                        element.cupidCoins
                                                )
                                                    .then(async order => {
                                                        updateSale(
                                                            element.sale.id
                                                        )
                                                            .then(
                                                                async sale => {
                                                                    if (
                                                                        itemsProcessed ==
                                                                        wholeCart.length
                                                                    ) {
                                                                        if (
                                                                            !cash
                                                                        ) {
                                                                            instance.payments
                                                                                .fetch(
                                                                                    payment.id
                                                                                )
                                                                                .then(
                                                                                    response =>
                                                                                        checkandcapturePayments(
                                                                                            response.id,
                                                                                            response.amount /
                                                                                                100,
                                                                                            cal_amount,
                                                                                            response.status
                                                                                        )
                                                                                )
                                                                                .catch(
                                                                                    error =>
                                                                                        console.log(
                                                                                            error
                                                                                        )
                                                                                );
                                                                        }
                                                                        await cart
                                                                            .deleteMany(
                                                                                {
                                                                                    "User.id": userId
                                                                                }
                                                                            )
                                                                            .then(
                                                                                () => {
                                                                                    console.log(
                                                                                        "Deleted"
                                                                                    );
                                                                                }
                                                                            )
                                                                            .catch(
                                                                                err => {
                                                                                    console.log(
                                                                                        err
                                                                                    );
                                                                                }
                                                                            );
                                                                    }
                                                                }
                                                            )
                                                            .catch(err => {
                                                                console.log(
                                                                    err
                                                                );
                                                            });
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                    });
                                            })
                                            .catch(err => {
                                                console.log(err);
                                            });
                                    });
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
        } else {
            createOrder(
                element.Product.id,
                element.sale.id,
                element.User.id,
                addressId,
                payment,
                "Processed",
                sale.salePrice - element.cupidCoins
            )
                .then(async order => {
                    updateSale(element.sale.id)
                        .then(async sale => {
                            if (itemsProcessed == wholeCart.length) {
                                if (!cash) {
                                    instance.payments
                                        .fetch(payment.id)
                                        .then(response =>
                                            checkandcapturePayments(
                                                response.id,
                                                response.amount / 100,
                                                cal_amount,
                                                response.status
                                            )
                                        )
                                        .catch(error => console.log(error));
                                }
                                await cart
                                    .deleteMany({ "User.id": userId })
                                    .then(() => {
                                        console.log("Deleted");
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    });
    console.log("Finished");
    return { status: true };
};

module.exports = {
    createCommitOrOrder,
    getUserCommits,
    getUserOrders,
    getCommitCountBySale
};
