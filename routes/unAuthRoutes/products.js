const express = require("express");
const router = express.Router();

// Models

const Products = require("../../models/Products");

router.get("/", function(req, res) {
    Products.find().then(function(products) {
        res.send(products);
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

module.exports = router;
