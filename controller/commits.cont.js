const cartCont = require("./cart.cont");
const mycommits = require("../models/mycommits");
const myOrders = require("../models/myorders");
const cupidLove = require("../models/CupidLove");
const Saleslist = require("../models/saleslist");
const Products = require("../models/Products");
const cart = require("../models/mycartingeneral");
const User = require("../models/user");
const config = require("../config/config");
const request = require("request");
const Referral = require("../models/referral");

const Razorpay = require("razorpay");

const getUserCommits = async userId => {
    return (
        mycommits
            .find(
                {
                    "User.id": userId
                },
                {
                    commit_amount: 1,
                    shipping_address: 1,
                    timecreated: 1,
                    referralAmount: 1,
                    size: 1,
                    quantity: 1
                }
            )
            .populate(
                "Product.id",
                "images brandName title marketPrice size sizeChart"
            )
            .populate("sale.id", "quantity_sold quantity_committed cupidLove")
            .sort({ timecreated: -1 })
            // .limit(limit)
            // .skip(skip)
            .exec()
    );
};

const getUserOrders = async userId => {
    return (
        myOrders
            .find(
                {
                    "User.id": userId
                },
                {
                    order_amount: 1,
                    "sale.id": 1,
                    timecreated: 1,
                    shipping_awb: 1,
                    order_status: 1,
                    shipping_address: 1,
                    timecreated: 1,
                    referralAmount: 1,
                    size: 1,
                    quantity: 1
                }
            )
            .populate(
                "Product.id",
                "images brandName title marketPrice size sizeChart"
            )
            .populate("sale.id", "salePrice")
            .sort({ timecreated: -1 })
            // .limit(limit)
            // .skip(skip)
            .exec()
    );
};

async function sendOrderDetailsToAdmin(
    message = "New%20Order%20arrived%20in%20list"
) {
    request.post(
        `https://api.msg91.com/api/sendhttp.php?authkey=${
            config.SMS.AUTH_KEY
        }&mobiles=9641222292&message=${message}&route=4&sender=CUPIDO&country=91`,
        { json: true },
        async function(error, response, body) {
            if (!error) {
                // console.log(body);
                return body;
            } else {
                return Promise.reject(error);
            }
        }
    );
}

async function sendOrderDetailsToUser(
    userId,
    message = "New%20Order%20placed%20successfully,%20keep%20checking%20your%20email%20for%20further%20updates."
) {
    User.findOne({ _id: userId }).then(user => {
        request.post(
            `https://api.msg91.com/api/sendhttp.php?authkey=${
                config.SMS.AUTH_KEY
            }&mobiles=${
                user.contact.contact
            }&message=${message}&route=4&sender=CUPIDO&country=91`,
            { json: true },
            async function(error, response, body) {
                if (!error) {
                    // console.log(body);
                    return body;
                } else {
                    return Promise.reject(error);
                }
            }
        );
    });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
const getCommitCountBySale = async id => {
    return mycommits
        .aggregate([
            {
                $match: {
                    "sale.id": id
                }
            },
            {
                $group: {
                    _id: "$sale.id",
                    sum: { $sum: "$quantity" }
                }
            }
        ])
        .then(result => {
            console.log(result);
            if (result.length == 0) {
                result.push({ sum: 0 });
            }
            return result[0].sum;
        })
        .catch(err => {
            console.log(err);
        });
};

const getOrderCountBySale = async id => {
    return myOrders
        .aggregate([
            {
                $match: {
                    "sale.id": id
                }
            },
            {
                $group: {
                    _id: "$sale.id",
                    count: { $sum: "$quantity" }
                }
            }
        ])
        .then(result => {
            console.log(result);
            if (result.length == 0) {
                result.push({ count: 0 });
            }
            return result[0].count;
        })
        .catch(err => {
            console.log(err);
        });
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
    amount,
    referralAmount,
    size,
    quantity
) => {
    commit1 = new mycommits({
        "Product.id": productId,
        "sale.id": saleId,
        "User.id": userId,
        shipping_address: addressId,
        payment_details: payment,
        commit_amount: amount,
        referralAmount: referralAmount,
        size: size,
        quantity: quantity
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
    amount,
    referralAmount,
    size,
    quantity
) => {
    order1 = new myOrders({
        "Product.id": productId,
        "sale.id": saleId,
        "User.id": userId,
        shipping_address: addressId,
        payment_details: payment,
        order_amount: amount,
        order_status: orderStatus,
        referralAmount: referralAmount,
        size: size,
        quantity: quantity
    });
    await sendOrderDetailsToAdmin();
    await sendOrderDetailsToUser(userId);
    return order1.save();
};

const updateProductOrder = async (productId, quantity) => {
    return Products.findOneAndUpdate(
        { _id: productId },
        { $inc: { quantity_sold: quantity } },
        { useFindAndModify: false }
    );
};

// const updateProductCommit = async (productId, quantity) => {
//     return Products.findOneAndUpdate(
//         { _id: productId },
//         { $inc: { quantity_committed: quantity } },
//         { useFindAndModify: false }
//     );
// };

const updateSaleCommit = async (saleId, quantity) => {
    return Saleslist.findOneAndUpdate(
        {
            _id: saleId
        },
        {
            $inc: {
                quantity_committed: quantity
            }
        },
        {
            useFindAndModify: false
        }
    );
};

const updateSaleOrder = async (saleId, quantity) => {
    return Saleslist.findOneAndUpdate(
        {
            _id: saleId
        },
        {
            $inc: {
                quantity_sold: quantity
            }
        },
        {
            useFindAndModify: false
        }
    );
};
1;
const updateUser = async (userId, balance) => {
    return User.findOneAndUpdate(
        { _id: userId },
        { $inc: { cupidCoins: balance } },
        { useFindOneAndModify: false }
    );
};

const createCupidLove = async (saleId, earned, UserId, cupidCoins) => {
    if (cupidCoins > 0) {
        earnedSum = await cupidLove.aggregate([
            {
                $match: {
                    earned: true,
                    "User.id": UserId
                }
            },
            { $group: { _id: null, sum: { $sum: "$amount" } } }
        ]);

        redeemedSum = await cupidLove.aggregate([
            {
                $match: {
                    earned: false,
                    "User.id": UserId
                }
            },
            { $group: { _id: null, sum: { $sum: "$amount" } } }
        ]);
        if (earnedSum.length == 0) {
            earnedSum = [{ sum: 0 }];
        }
        if (redeemedSum.length == 0) {
            redeemedSum = [{ sum: 0 }];
        }
        if (earned) {
            const cupidlove1 = new cupidLove({
                "Sale.id": saleId,
                earned: earned,
                "User.id": UserId,
                amount: cupidCoins,
                balance: earnedSum[0].sum - redeemedSum[0].sum + cupidCoins,
                source: "sale"
            });
            await cupidlove1.save();
            await updateUser(
                UserId,
                earnedSum[0].sum - redeemedSum[0].sum + cupidCoins
            )
                .then(() => {
                    return console.log("success");
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            const cupidlove1 = new cupidLove({
                "Sale.id": saleId,
                earned: earned,
                "User.id": UserId,
                amount: cupidCoins,
                balance: earnedSum[0].sum - redeemedSum[0].sum - cupidCoins,
                source: "sale"
            });
            await cupidlove1.save();
            await updateUser(
                UserId,
                earnedSum[0].sum - redeemedSum[0].sum - cupidCoins
            )
                .then(() => {
                    return console.log("success");
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};

const createCouponReward = async (list, saleId, userId) => {
    asyncForEach(list, async item => {
        Referral.findOne({ _id: item }).then(async referral => {
            cupidlove1 = new cupidLove({
                "Sale.id": saleId,
                earned: true,
                "User.id": userId,
                amount: referral.amount,
                referralId: referral._id,
                source: "referral"
            });
            cupidlove2 = new cupidLove({
                "Sale.id": saleId,
                earned: true,
                "User.id": referral.createdBy,
                amount: referral.amount,
                referralId: referral._id,
                source: "referral"
            });
            cupidlove3 = new cupidLove({
                "Sale.id": saleId,
                earned: false,
                "User.id": userId,
                amount: referral.amount,
                referralId: referral._id,
                source: "referral"
            });
            const arr = [cupidlove1, cupidlove2, cupidlove3];
            await cupidLove.insertMany(arr);
            await Referral.findByIdAndUpdate(
                referral._id,
                { $push: { usedBy: userId } },
                { new: true }
            );
            await Referral.findOne({ createdBy: userId, sale: saleId }).then(
                async referral => {
                    if (referral) {
                        await cupidLove.findOneAndUpdate(
                            { referralId: referral._id },
                            { earned: false },
                            { new: true }
                        );
                    }
                }
            );
            await Referral.findByIdAndUpdate(referral._id, {
                $pullAll: { cart: [userId] }
            });
        });
    });
};

const createCommitOrOrder = async (
    wholeCart,
    addressId,
    payment,
    userId,
    cash
) => {
    console.log("Entered into Function");
    var itemsProcessed = 0;
    cal_amount = 0;
    asyncForEach(wholeCart, async element => {
        itemsProcessed++;
        // let commit_count = await getCommitCountBySale(element.sale.id);
        // let order_count = await getOrderCountBySale(element.sale.id);
        // console.log(commit_count, order_count);
        let sale = await Saleslist.findById(element.sale.id);
        let commit_count = sale.quantity_committed;
        let order_count = sale.quantity_sold;
        console.log(commit_count, order_count);
        cal_amount += sale.salePrice * element.quantity;
        if (element.is_commit) {
            cal_amount -= element.quantity * sale.cupidLove.cupidLove;
        }
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
                (sale.salePrice - element.cupidCoins) * element.quantity,
                element.referralAmount,
                element.size,
                element.quantity
            )
                .then(async commit => {
                    await updateSaleCommit(element.sale.id, element.quantity)
                        .then(async sale => {
                            await updateProductOrder(
                                element.Product.id,
                                element.quantity
                            )
                                .then(async product => {
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
                                                .catch(error =>
                                                    console.log(error)
                                                );
                                        }
                                        await cart
                                            .deleteMany({ "User.id": userId })
                                            .then(() => {
                                                console.log("Deleted");
                                                // return { status: true };
                                            })
                                            .catch(err => {
                                                console.log(err);
                                            });
                                    }
                                    await createCupidLove(
                                        element.sale.id,
                                        true,
                                        userId,
                                        element.cupidCoins * element.quantity
                                    );
                                    await createCupidLove(
                                        element.sale.id,
                                        false,
                                        userId,
                                        element.cupidCoins * element.quantity
                                    );
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
                (sale.salePrice - element.cupidCoins) * element.quantity,
                element.referralAmount,
                element.size,
                element.quantity
            )
                .then(async order => {
                    await updateSaleOrder(element.sale.id, element.quantity)
                        .then(async sale => {
                            await updateProductOrder(
                                element.Product.id,
                                element.quantity
                            )
                                .then(async product => {
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
                                                .catch(error =>
                                                    console.log(error)
                                                );
                                        }
                                        await cart
                                            .deleteMany({ "User.id": userId })
                                            .then(() => {
                                                console.log("Deleted");
                                                return { status: true };
                                            })
                                            .catch(err => {
                                                console.log(err);
                                            });
                                    }
                                    await createCupidLove(
                                        element.sale.id,
                                        true,
                                        userId,
                                        element.cupidCoins * element.quantity
                                    );
                                    await createCupidLove(
                                        element.sale.id,
                                        false,
                                        userId,
                                        element.cupidCoins * element.quantity
                                    );
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
        }
        if (element.referralList.length > 0) {
            await createCouponReward(
                element.referralList,
                element.sale.id,
                userId
            );
        }
    });
    console.log("Finished");
    return { status: true };
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
//         if (element.is_commit) {
//             cal_amount -= sale.cupidLove.cupidLove;
//         }
//         console.log(sale.cupidLove.quantity);
//         if (
//             element.is_commit &&
//             commit_count + order_count < sale.cupidLove.quantity
//         ) {
//             createCommit(
//                 element.Product.id,
//                 element.sale.id,
//                 element.User.id,
//                 addressId,
//                 payment,
//                 sale.salePrice - element.cupidCoins
//             )
//                 .then(async commit => {
//                     await updateSaleCommit(element.sale.id)
//                         .then(async sale => {
//                             await createCupidLove(
//                                 element.sale.id,
//                                 false,
//                                 userId,
//                                 sale.cupidLove.cupidLove
//                             ).then(async () => {
//                                 if (itemsProcessed == wholeCart.length) {
//                                     if (!cash) {
//                                         instance.payments
//                                             .fetch(payment.id)
//                                             .then(response =>
//                                                 checkandcapturePayments(
//                                                     response.id,
//                                                     response.amount / 100,
//                                                     cal_amount,
//                                                     response.status
//                                                 )
//                                             )
//                                             .catch(error => console.log(error));
//                                     }
//                                     await cart
//                                         .deleteMany({ "User.id": userId })
//                                         .then(() => {
//                                             console.log("Deleted");
//                                             // return { status: true };
//                                         })
//                                         .catch(err => {
//                                             console.log(err);
//                                         });
//                                 }
//                             });
//                         })
//                         .catch(err => {
//                             console.log(err);
//                         });
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 });
//         } else if (
//             element.is_commit &&
//             commit_count + order_count >= sale.cupidLove.quantity
//         ) {
//             createOrder(
//                 element.Product.id,
//                 element.sale.id,
//                 element.User.id,
//                 addressId,
//                 payment,
//                 "Processed",
//                 sale.salePrice - element.cupidCoins
//             )
//                 .then(async order => {
//                     updateSaleOrder(element.sale.id)
//                         .then(async () => {
//                             await createCupidLove(
//                                 element.sale.id,
//                                 false,
//                                 userId,
//                                 sale.cupidLove.cupidLove
//                             )
//                                 .then(async () => {
//                                     await mycommits
//                                         .find({
//                                             "sale.id": element.sale.id
//                                         })
//                                         .then(async commits => {
//                                             console.log("done1");
//                                             asyncForEach(
//                                                 commits,
//                                                 async commit => {
//                                                     console.log("done3");
//                                                     await mycommits
//                                                         .findByIdAndRemove(
//                                                             commit._id
//                                                         )
//                                                         .then(async () => {
//                                                             // delete commit._id;
//                                                             await createOrder(
//                                                                 commit.Product
//                                                                     .id,
//                                                                 commit.sale.id,
//                                                                 commit.User.id,
//                                                                 commit.shipping_address,
//                                                                 commit.payment_details,
//                                                                 "Processed",
//                                                                 sale.salePrice -
//                                                                     element.cupidCoins
//                                                             )
//                                                                 .then(
//                                                                     async order => {
//                                                                         await updateSaleOrder(
//                                                                             element
//                                                                                 .sale
//                                                                                 .id
//                                                                         )
//                                                                             .then(
//                                                                                 async () => {
//                                                                                     console.log(
//                                                                                         "done2"
//                                                                                     );
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
//                                                                 )
//                                                                 .catch(err => {
//                                                                     console.log(
//                                                                         err
//                                                                     );
//                                                                 });
//                                                         })
//                                                         .catch(err => {
//                                                             console.log(err);
//                                                         });
//                                                 }
//                                             );
//                                         })
//                                         .catch(err => {
//                                             console.log(err);
//                                         });
//                                     if (itemsProcessed == wholeCart.length) {
//                                         if (!cash) {
//                                             await instance.payments
//                                                 .fetch(payment.id)
//                                                 .then(response =>
//                                                     checkandcapturePayments(
//                                                         response.id,
//                                                         response.amount / 100,
//                                                         cal_amount,
//                                                         response.status
//                                                     )
//                                                 )
//                                                 .catch(error =>
//                                                     console.log(error)
//                                                 );
//                                         }
//                                         await cart
//                                             .deleteMany({
//                                                 "User.id": userId
//                                             })
//                                             .then(() => {
//                                                 console.log("Deleted");
//                                                 // return { status: true };
//                                             })
//                                             .catch(err => {
//                                                 console.log(err);
//                                             });
//                                     }
//                                 })
//                                 .catch(err => {
//                                     console.log(err);
//                                 });
//                         })
//                         .catch(err => {
//                             console.log(err);
//                         });
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 });
//         } else {
//             createOrder(
//                 element.Product.id,
//                 element.sale.id,
//                 element.User.id,
//                 addressId,
//                 payment,
//                 "Processed",
//                 sale.salePrice - element.cupidCoins
//             )
//                 .then(async order => {
//                     updateSaleOrder(element.sale.id)
//                         .then(async sale => {
//                             if (itemsProcessed == wholeCart.length) {
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
//                                         // return { status: true };
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

module.exports = {
    createCommitOrOrder,
    getUserCommits,
    getUserOrders,
    getCommitCountBySale
};
