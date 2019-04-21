const Products = require("../models/Products");
const Category = require("../models/categorylist");

const searchWithKeyword = async key => {
    console.log(key);
    const products = await Products.find({
        title: { $regex: key, $options: "i" }
    })
        .select({ "likedlist.meta": 0 })
        .exec();
    console.log(1);
    const category = await Category.find({
        category_name: { $regex: key, $options: "i" }
    })
        .select({ category_name: 1 })
        .exec();
    console.log(2);
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
    req_query
) => {
    let category=req_query.category;
    delete req_query.category;
    var query=`{"category":"${category}"`;
    Object.keys(req_query).forEach(function(key){
        query+=`,"filters.${key}":"${req_query[key]}"`;
    });
    query=JSON.parse(query+'}');
    const skip = limit * (page - 1);
    limit = skip + limit;
    
    console.log(query)

    return await Products.find(query)
        .select({ "likedlist.meta": 0 })
        .limit(limit)
        .skip(skip)
        .exec();
};


module.exports = { searchWithKeyword, getProductById, getAllProducts };
