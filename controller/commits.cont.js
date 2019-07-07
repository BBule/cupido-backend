const cartCont = require("./cart.cont");
const mycommits = require("../models/mycommits");
const myOrders = require("../models/myorders");
const cupidLove = require("../models/CupidLove");
const Saleslist = require("../models/saleslist");
const cart = require("../models/mycartingeneral");
const User = require("../models/user");
const config = require("../config/config");

const Razorpay = require("razorpay");

const getUserCommits = async userId => {
    return (
        mycommits
            .find(
                {
                    "User.id": userId
                },
                { commit_amount: 1,shipping_address:1}
            )
            .populate("Product.id", "images brandName title")
            .populate("sale.id", "quantity_sold quantity_committed cupidLove")
            .sort({timecrteated:-1})
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
                    shipping_address:1
                }
            )
            .populate("Product.id", "images brandName title")
            .populate("sale.id", "salePrice")
            .sort({timecrteated:-1})
            // .limit(limit)
            // .skip(skip)
            .exec()
    );
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
    commitId,
    amount
) => {
    order1 = new myOrders({
        "Product.id": productId,
        "sale.id": saleId,
        "User.id": userId,
        shipping_address: addressId,
        payment_details: payment,
        order_amount: amount,
        commitId:commitId,
        order_status: orderStatus
    });
    return order1.save();
};

const updateSaleCommit = async saleId => {
    return Saleslist.findOneAndUpdate(
        {
            _id: saleId
        },
        {
            $inc: {
                quantity_committed: await getCommitCountBySale(saleId)
            }
        },
        {
            useFindAndModify: false
        }
    );
};

const updateSaleOrder = async saleId => {
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

const updateUser = async (userId, balance) => {
    return User.findOneAndUpdate(
        { _id: userId },
        { cupidCoins: balance },
        { useFindOneAndModify: false }
    );
};

const createCupidLove = async (saleId, earned, UserId, cupidCoins) => {
    if (cupidCoins > 0) {
        earnedSum = await cupidLove.aggregate([
            {
                $match: {
                    earned: true
                }
            },
            { $group: { _id: null, sum: { $sum: "$amount" } } }
        ]);

        redeemedSum = await cupidLove.aggregate([
            {
                $match: {
                    earned: false
                }
            },
            { $group: { _id: null, sum: { $sum: "$amount" } } }
        ]);

        const cupidlove1 = new cupidLove({
            "Sale.id": saleId,
            earned: earned,
            "User.id": UserId,
            amount: cupidCoins,
            balance: earnedSum[0].sum - redeemedSum[0].sum - cupidCoins,
            source: "sale",
            earned: true
        });
        await updateUser(
            UserId,
            earnedSum[0].sum - redeemedSum[0].sum + cupidCoins
        )
            .then(() => {
                return cupidlove1.save();
            })
            .catch(err => {
                console.log(err);
            });
    }
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
        if (element.is_commit) {
            cal_amount -= sale.cupidLove.cupidLove;
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
                sale.salePrice - element.cupidCoins
            )
                .then(async commit => {
                    await updateSaleCommit(element.sale.id)
                        .then(async sale => {
                            await createCupidLove(
                                element.sale.id,
                                false,
                                userId,
                                sale.cupidLove.cupidLove
                            ).then(async () => {
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
                                            // return { status: true };
                                            
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                                }
                            });
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
                "",
                sale.salePrice - element.cupidCoins
            )
                .then(async order => {
                    updateSaleOrder(element.sale.id)
                        .then(async () => {
                            await createCupidLove(
                                element.sale.id,
                                false,
                                userId,
                                sale.cupidLove.cupidLove
                            )
                                .then(async () => {
                                    await mycommits
                                        .find({
                                            "sale.id": element.sale.id
                                        })
                                        .then(async commits => {
                                            console.log("done1");
                                            asyncForEach(
                                                commits,
                                                async commit => {
                                                    console.log("done3");
                                                    await mycommits
                                                        .findByIdAndRemove(
                                                            commit._id
                                                        )
                                                        .then(async () => {
                                                            // delete commit._id;
                                                            await createOrder(
                                                                commit.Product
                                                                    .id,
                                                                commit.sale.id,
                                                                commit.User.id,
                                                                commit.shipping_address,
                                                                commit.payment_details,
                                                                "Processed",
                                                                commit._id,
                                                                sale.salePrice -
                                                                    element.cupidCoins
                                                            )
                                                                .then(
                                                                    async order => {
                                                                        await updateSaleOrder(
                                                                            element
                                                                                .sale
                                                                                .id
                                                                        )
                                                                            .then(
                                                                                async () => {
                                                                                    console.log(
                                                                                        "done2"
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
                                                }
                                            );
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                                    if (itemsProcessed == wholeCart.length) {
                                        if (!cash) {
                                            await instance.payments
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
                                            .deleteMany({
                                                "User.id": userId
                                            })
                                            .then(() => {
                                                console.log("Deleted");
                                                // return { status: true };                                             
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
                "",
                sale.salePrice - element.cupidCoins
            )
                .then(async order => {
                    updateSaleOrder(element.sale.id)
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
                                        // return { status: true };
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