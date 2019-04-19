const express = require("express");
const router = express.Router();

const productCont = require("../../controller/product.cont");

router.get("/", function(req, res, next) {
    const { page = 1, limit = 20, categry = null, brand = null } = req.query;
    return productCont
        .getAllProducts(page, limit, categry, brand)
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
// API end point to route traffic of product page
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
