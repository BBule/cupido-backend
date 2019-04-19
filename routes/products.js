const express = require("express");
const router = express.Router();

// Models

const Products = require("../models/Products");

router.post("/like", async function(req, res) {
    let curruser = req.user;
    try {
        var ProductLiked = await Products.findOne({
            _id: req.body.productid,
            "likedlist.meta": curruser._id
        })
            .select({ "likedlist.meta.$": 1 })
            .exec();
        if (
            ProductLiked &&
            ProductLiked.likedlist &&
            ProductLiked.likedlist.meta &&
            ProductLiked.likedlist.meta.length
        ) {
            var product = await Products.findOneAndUpdate(
                { _id: req.body.productid },
                {
                    $pull: { "likedlist.meta": curruser._id },
                    $inc: { "likedlist.count": -1 }
                },
                { new: true }
            )
                .select({ "product.likedlist.count": 1 })
                .exec();
            res.send({ likes: product.likedlist.count, user_liked: false });
        } else {
            var product = await Products.findOneAndUpdate(
                { _id: req.body.productid },
                {
                    $push: { "likedlist.meta": curruser._id },
                    $inc: { "likedlist.count": 1 }
                },
                { new: true }
            )
                .select({ "product.likedlist.count": 1 })
                .exec();
            res.send({ likes: product.likedlist.count, user_liked: true });
        }
    } catch (e) {
        console.log(e);
        return next({
            message: e.message || "unknown error",
            status: 400,
            stack: e
        });
    }
});

module.exports = router;
