const express = require("express");
const router = express.Router();

const productCont = require("../../controller/product.cont");


const Products = require("../../models/Products");


/**
 * Get all products pagination and partial filerts
 * Filter with: category name,brand
 */
router.get("/", function(req, res, next) {
    const { page = 1, limit = 20} = req.query;
    delete req.query.page;
    delete req.query.limit;
    return productCont
        .getAllProducts(page, limit, req.query)
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

router.get("/aggregate", async (req, res, next) => {
    var results=await Products.aggregate([
        {$group: {
            _id: null,
            title: {$addToSet: '$title'},
            category: {$addToSet: '$category'},
            gender: {$addToSet: '$gender'}
            }}
        ]);
    res.send(results);
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
