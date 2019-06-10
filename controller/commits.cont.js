const cartCont = require("./cart.cont");
const mycommits = require("../models/mycommits");
const myOrders = require("../models/myorders");
const Saleslist = require("../models/saleslist");

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

const getCommitCountBySale = async id => {
    return mycommits.countDocuments({ "sale.id": id }).exec();
};

const createCommitOrOrder = async (wholeCart, addressId,payment, userId) => {
    let promiseArr = [];

    wholeCart.forEach(async element => {
        let commit_count=await getCommitCountBySale(element.sale.id);
        let sale=await Saleslist.findById(element.sale.id);
        if (element.is_commit&&commit_count<sale.cupidLove.quantity) {
            promiseArr.push(
                new mycommits({
                    ...element,
                    shipping_address: addressId
                }).save()
            );
        }
        else if(element.is_commit&&commit_count>=sale.cupidLove.quantity){
            promiseArr.push(
                new myOrders({
                    ...element,
                    shipping_address: addressId
                }).save()
            );
            let commits=await mycommits.find({ "sale.id": element.sale.id });
            commits.forEach(function(commit) {
                promiseArr.push(
                    mycommits.findByIdAndRemove(commit._id)
                );
                delete commit._id
                promiseArr.push(
                    new myOrders(commit).save()
                );

            });

        } else {
            //order
            promiseArr.push(
                new myOrders({
                    ...element,
                    shipping_address: addressId
                }).save()
            );
        }
        if(element.referral_code){
           promiseArr.push(Referral.findOneAndUpdate({code:element.referral_code},{used:true,usedBy:userId}));
            var referralBy=await Referral.findOne({code:element.referral_code}).select('createdBy');
            promiseArr.push(User.findByIdAndUpdate(referralBy,{ $inc: { cupidCoins: 50 }}));
        }
        promiseArr.push(cartCont.removeFromCart(wholeCart._id, userId));
    });

    return Promise.all(promiseArr)
        .then(data => {
            return { success: true };
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

module.exports = { createCommitOrOrder, getUserCommits, getCommitCountBySale };
