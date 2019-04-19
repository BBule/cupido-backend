const Products = require("../models/Products");
const Category = require("../models/categorylist");

const searchWithKeyword = async key => {
    const products = await Products.find({
        title: { $regex: key, $options: "i" }
    })
        .select({ "likedlist.meta": 0 })
        .exec();
    const category = await Category.find({
        category_name: { $regex: key, $options: "i" }
    })
        .select("category_name")
        .exec();
    return { categories: category, products: products };
};

const getProductById = async id => {
    return await Products.findOne({ _id: id })
        .select({ "likedlist.meta": 0 })
        .exec();
};

const getAllProducts = async (
    page = 1,
    limit = 20,
    category = null,
    brand = null
) => {
    let query = {};
    const skip = limit * (page - 1);
    const limit = skip + limit;
    if (category) {
        query["Category"] = category;
    }
    if (brand) {
        query["brandName"] = brand;
    }

    return await Products.find(query)
        .select({ "likedlist.meta": 0 })
        .limit(limit)
        .skip(skip)
        .exec();
};

module.exports = { searchWithKeyword, getProductById, getAllProducts };
