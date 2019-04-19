const express = require("express");
const router = express.Router();

const productCont = require("../../controller/product.cont");

<<<<<<< HEAD
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
=======
/**
 * Get all products pagination and partial filerts
 * Filter with: category name,brand
 */
router.get("/", function(req, res, next) {
    const { page = 1, limit = 20, categry = null, brand = null } = req.query;
    return productCont
        .getAllProducts(page, limit, categry, brand)
        .then(Data => {
            return res.json(Data);
>>>>>>> 3b39e57801adb812b5224edb88a306b131ec3ebc
        })
        .catch(error => {
            return next({
                message: error.message || "Unknown error",
                status: 400,
                stack: error
            });
        });
});

/**
 * Get Product By Id
 */
router.get("/:id", (req, res, next) => {
    return productCont
        .getProductById(req.params.id)
        .then(() => {
            console.log("Product is found and it's category: ");
            console.log(productholder.Category);
            res.send({
                productdata: productholder
            });
        })
        .catch(err => {
            return next({
                message: err.message || "Unknown error",
                status: 400,
                stack: err
            });
        });
});

/**
 * Using a keyword
 * Searches in Category names
 * Searches in Product name
 */
router.get("/s", (req, res, next) => {
    const keyword = decodeURIComponent(req.query.keyword);
    return productCont
        .searchWithKeyword(keyword)
        .then(data => {
            return res.json(data);
        })
        .catch(error => {
            return next({
                message: error.message || "Unknown error",
                status: 400,
                stack: error
            });
        });
});

module.exports = router;
