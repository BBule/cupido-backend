const express = require("express");
const router = express.Router();
const Orders = require("../../models/myorders");
const Commits = require("../../models/mycommits");
const Sales = require("../../models/saleslist");

const productCont = require("../../controller/product.cont");

const Products = require("../../models/Products");

/**
 * Get all products pagination and partial filerts
 * Filter with: category name,brand
 */
router.get("/", function(req, res, next) {
    const { page = 1, limit = 20 } = req.query;
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

/**
 * Get Product By Id
 */
router.get("/getDetails/:id", (req, res, next) => {
    console.log(req.params.id);
    return productCont
        .getProductById(req.params.id)
        .then(productholder => {
            console.log("Product is found and it's category: ");
            res.json(productholder);
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

router.get("/product/:brandName", (req, res, next) => {
    const brandName = req.params.brandName;
    Products.find({ brandName: brandName })
        .then(products => {
            if (!products.length) {
                return res.send([]);
            }
            return res.send(products);
        })
        .catch(err => {
            return next({
                message: err.message,
                status: 400,
                stack: err
            });
        });
});

router.get("/brandNames", (req, res, next) => {
    const category = req.query.category;
    Products.distinct("brandName", { category: category })
        .then(result => {
            if (!result) {
                return res.send([]);
            }
            return res.send(result);
        })
        .catch(err => {
            return next({
                message: err.message,
                status: 400,
                stack: err
            });
        });
});

router.get("/subCategories", (req, res, next) => {
    const category = req.query.category;
    Products.distinct("subCategory", { category: category })
        .then(result => {
            if (!result) {
                return res.send([]);
            }
            return res.send(result);
        })
        .catch(err => {
            return next({
                message: err.message,
                status: 400,
                stack: err
            });
        });
});

router.get("/allOrders", (req, res, next) => {
    Orders.find(
        {},
        {
            order_amount: 1,
            "sale.id": 1,
            shipping_awb: 1,
            order_status: 1,
            shipping_address: 1,
            referralAmount: 1,
            size: 1,
            color: 1,
            quantity: 1,
            timecreated: 1
        }
    )
        .populate("Product.id", "images brandName title marketPrice size color")
        .populate("User.id", "email.email contact.contact username gender")
        .populate("sale.id", "salePrice")
        .sort({ timecreated: -1 })
        .then(orders => {
            return res.send(orders);
        })
        .catch(err => {
            return next({
                message: err.message,
                status: 400,
                stack: err
            });
        });
});

router.get("/allSales", (req, res, next) => {
    Sales.find()
        .then(sales => {
            return res.send(sales);
        })
        .catch(err => {
            return next({
                message: err.message,
                status: 400,
                stack: err
            });
        });
});

router.get("/allCommits", (req, res, next) => {
    Commits.find(
        {},
        {
            commit_amount: 1,
            "sale.id": 1,
            shipping_address: 1,
            referralAmount: 1,
            size: 1,
            color: 1,
            quantity: 1,
            timecreated: 1
        }
    )
        .populate("Product.id", "images brandName title marketPrice size color")
        .populate("User.id", "email.email contact.contact username gender")
        .populate("sale.id", "salePrice")
        .sort({ timecreated: -1 })
        .then(orders => {
            return res.send(orders);
        })
        .catch(err => {
            return next({
                message: err.message,
                status: 400,
                stack: err
            });
        });
});

router.get("/allOrders", (req, res, next) => {
    Orders.find(
        {},
        {
            order_amount: 1,
            "sale.id": 1,
            shipping_awb: 1,
            order_status: 1,
            shipping_address: 1,
            referralAmount: 1,
            size: 1,
            color: 1,
            quantity: 1,
            timecreated: 1
        }
    )
        .populate("Product.id", "images brandName title marketPrice size color")
        .populate("sale.id", "salePrice")
        .sort({ timecreated: -1 })
        .then(orders => {
            return res.send(orders);
        })
        .catch(err => {
            return next({
                message: err.message,
                status: 400,
                stack: err
            });
        });
});

module.exports = router;
