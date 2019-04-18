const express = require("express");
const router = express.Router();

// Models

const Products = require("../models/Products");

router.get("/", function(req, res) {
    Products.find().then(function(users) {
        res.send(users);
    });
});
// API end point to route traffic of product page
router.get("/:prodname", (req, res) => {
    var prodname = req.params.prodname.replace(/_/g, " ");
    var productholder;
    Products.findOne({ title: prodname })
        .then(result => {
            productholder = result;
        })
        .then(() => {
            if (productholder == null || productholder.length == 0) {
                console.log("No products found");
                res.status(200).send({
                    productdata: "No products found"
                });
            } else {
                console.log("Product is found and it's category: ");
                console.log(productholder.Category);
                res.status(200).send({
                    productdata: productholder
                });
            }
        })
        .catch(err => {
            res.status(400).send("Bad request");
        });
});

router.post("/like", async function(req, res) {
    let curruser = req.user;
    try {
        var ProductLiked = await Products.findOne({
            _id: req.body.productid,
            "likedlist.meta": curruser._id
        });
        if (ProductLiked) {
            var product = await Products.findOneAndUpdate(
                { _id: req.body.productid },
                {
                    $pull: { "likedlist.meta": curruser._id },
                    $inc: { "likedlist.count": -1 }
                },
                { new: true }
            );
            res.send({ likes: product.likedlist.count, user_liked: false });
        } else {
            var product = await Products.findOneAndUpdate(
                { _id: req.body.productid },
                {
                    $push: { "likedlist.meta": curruser._id },
                    $inc: { "likedlist.count": 1 }
                },
                { new: true }
            );
            res.send({ likes: product.likedlist.count, user_liked: true });
        }
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

module.exports = router;
