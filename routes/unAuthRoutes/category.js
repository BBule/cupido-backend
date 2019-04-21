const express = require("express");
const router = express.Router();


const Products = require("../../models/Products");
const Category = require("../../models/categorylist");

router.get("/", async (req, res, next) => {

    let categories=await Category.find();
    res.send(categories);
});

router.get("/filters/:id", async (req, res, next) => {

    const filters = await Category.find({_id:req.params.id}).select('filters').exec();
    var query={};
    filters[0].filters.forEach(function(filter) {
        query[filter]={$addToSet: `$filters.${filter}`};
        console.log(filter);
    });
    query['_id']=null;
    var results=await Products.aggregate([
        {$group:query}
        ]);
    res.send(results);
});

module.exports = router;
