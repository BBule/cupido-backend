const express = require("express");
const router = express.Router();

const {
    searchWithKeyword,
    getProductById,
    getAllProducts
} = require("../../controller/product.cont");

/**
 * Get all products pagination and partial filerts
 * Filter with: category name,brand
 */
router.get("/", function(req, res, next) {
    const { page = 1, limit = 20, category = null, brand = null } = req.query;
    return getAllProducts(page, limit, category, brand)
        .then(Data => {
            return res.json(Data);
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
router.get("/getDetails/:id", (req, res, next) => {
    return getProductById(req.params.id)
        .then(productholder => {
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
    console.log(req.query.keyword);
    const keyword = decodeURIComponent(req.query.keyword);
    console.log(12);
    return searchWithKeyword(keyword)
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
