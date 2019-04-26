const mongoose = require("mongoose");
const User = require("../models/user");

const mycartingeneral = require("../models/mycartingeneral");

const removeFromCart = async (cartitemId, user) => {
    await mycartingeneral.findByIdAndRemove(cartitemId);
    return await User.findOneAndUpdate(
        { _id: user },
        { $pull: { mycarts: { _id: mongoose.Types.ObjectId(cartitemId) } } }
    );
};

module.exports = {
    removeFromCart
};
