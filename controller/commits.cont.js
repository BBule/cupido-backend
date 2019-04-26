const cartCont = require("./cart.cont");

const mycommits = require("../models/mycommits");
const myOrders = require("../models/myorders");

createCommitOrOrder = (wholeCart, addressId, userId) => {
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

module.exports = { createCommitOrOrder };
