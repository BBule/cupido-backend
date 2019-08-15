const express = require("express");
const router = express.Router();

const Products = require("../../models/Products");
const Category = require("../../models/categorylist");

router.get("/", async (req, res, next) => {
    let categories = await Category.find();
    res.send(categories);
});

router.get("/filters/:id", async (req, res, next) => {
    const filters = await Category.find({ _id: req.params.id })
        .select("filters")
        .exec();
    var query = {};
    filters[0].filters.forEach(function(filter) {
        query[filter] = { $addToSet: `$filters.${filter}` };
        console.log(filter);
    });
    query["_id"] = null;
    var results = await Products.aggregate([{ $group: query }]);
    res.send(results);
});

const categories = [
    {
        label: "Home Furnitures",
        apiCat: "furnitures",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/bedroom.jpg"
    },
    {
        label: "Mattresses",
        apiCat: "mattress",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/mattress.jpg"
    },
    {
        label: "Men's Clothing",
        apiCat: "mensclothing",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/Shape.jpg"
    },
    {
        label: "Women's Clothing",
        apiCat: "womensclothing",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/sexy-feminine-dress-in-black.jpg"
    },
    {
        label: "College Stationary",
        apiCat: "collegestationary",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/stationery.jpg"
    },
    {
        label: "Socks",
        apiCat: "socks",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/socks.jpg"
    },
    {
        label: "Laptops",
        apiCat: "laptops",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/laptop.jpg"
    },
    {
        label: "Backpacks",
        apiCat: "backpack",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/school-book-bag.jpg"
    },
    {
        label: "Audio",
        apiCat: "audio",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/headphone-symbol.jpg"
    },
    {
        label: "Men's Grooming",
        apiCat: "mensgrooming",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/hairstyle.jpg"
    },
    {
        label: "Women's Beauty",
        apiCat: "womensbeauty",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/make-up.jpg"
    },
    {
        label: "Bicycles",
        apiCat: "bicycle",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/man-cycling.jpg"
    },
    {
        label: "Men's Footwear",
        apiCat: "mensfootwear",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/mensfootwear.jpg"
    },
    {
        label: "Women's Footwear",
        apiCat: "womensfootwear",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/high-heel.jpg"
    }
];

router.get("/allCats", (req, res, next) => {
    return res.json(categories);
});

module.exports = router;
