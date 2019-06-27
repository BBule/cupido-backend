const mongoose = require("mongoose");
const User = require("../models/user");

const mycartingeneral = require("../models/mycartingeneral");

const removeFromCart = async (cartitemId, userId) => {
    return mycartingeneral.findByIdAndRemove({_id:cartitemId});
    // return await User.findOneAndUpdate(
    //     { _id: user },
    //     { $pull: { mycarts: { _id: mongoose.Types.ObjectId(cartitemId) } } }
    // );
    // return await cart
    //     .delete({
    //         "User.id": userId
    //     });
};

module.exports = {
    removeFromCart
};
