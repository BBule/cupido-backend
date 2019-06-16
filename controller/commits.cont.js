const cartCont = require("./cart.cont");
const mycommits = require("../models/mycommits");
const myOrders = require("../models/myorders");
const Saleslist = require("../models/saleslist");
const cart = require("../models/mycartingeneral.js");

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
        .populate("Product.id")
        .populate("sale.id")
        .populate("shipping_address")
        .limit(limit)
        .skip(skip)
        .exec();
};

const getUserOrders = async (userId, limit = 10, skip = 0) => {
    return await myOrders
        .find({
            "User.id": userId
        })
        .populate("Product.id")
        .populate("shipping_address")
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

const createCommitOrOrder = async (wholeCart, addressId, payment, userId) => {
    var itemsProcessed = 0;
    asyncForEach(wholeCart, async element => {
        itemsProcessed++;
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
                payment_details: payment,
                commit_amount: element.salePrice - element.cupidCoins
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
                            if (itemsProcessed == wholeCart.length) {
                                console.log(itemsProcessed, wholeCart.length);
                                await cart
                                    .findByIdAndRemove(userId)
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
                payment_details: payment,
                order_amount: element.salePrice - element.cupidCoins
            });
            order1
                .save()
                .then(async order => {
                    await Saleslist.findOneAndUpdate(
                        {
                            _id: element.sale.id
                        },
                        {
                            $inc: {
                                quantity_sold: 1
                            }
                        },
                        {
                            useFindAndModify: false
                        }
                    )
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
                                                order1 = new myOrders({
                                                    "Product.id":
                                                        commit.Product.id,
                                                    "sale.id": commit.sale.id,
                                                    "User.id": commit.User.id,
                                                    shipping_address: addressId,
                                                    payment_details: payment,
                                                    commit_amount:
                                                        element
                                                            .salePrice -
                                                        element.cupidCoins
                                                });
                                                // console.log(order1)
                                                // console.log(commit)
                                                order1
                                                    .save()
                                                    .then(async order => {
                                                        // console.log("Orderinloopsaved");
                                                        await Saleslist.findOneAndUpdate(
                                                            {
                                                                _id:
                                                                    element.sale
                                                                        .id
                                                            },
                                                            {
                                                                $inc: {
                                                                    quantity_sold: 1
                                                                }
                                                            },
                                                            {
                                                                useFindAndModify: false
                                                            }
                                                        )
                                                            .then(
                                                                async sale => {
                                                                    // console.log("Hurray1");
                                                                    if (
                                                                        itemsProcessed ==
                                                                        wholeCart.length
                                                                    ) {
                                                                        console.log(
                                                                            itemsProcessed,
                                                                            wholeCart.length
                                                                        );
                                                                        await cart
                                                                            .findByIdAndRemove(
                                                                                userId
                                                                            )
                                                                            .then(
                                                                                () => {
                                                                                    // console.log("Deleted");
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
                                        // console.log("Hurray2");
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                    // console.log("Hurray3");
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
                payment_details: payment,
                commit_amount: element.salePrice - element.cupidCoins
            });
            order1
                .save()
                .then(async order => {
                    Saleslist.findOneAndUpdate(
                        { _id: element.sale.id },
                        { $inc: { quantity_sold: 1 } },
                        { useFindAndModify: false }
                    )
                        .then(async sale => {
                            // console.log("OrderPlaced");
                            if (itemsProcessed == wholeCart.length) {
                                console.log(itemsProcessed, wholeCart.length);
                                await cart
                                    .findByIdAndRemove(userId)
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
