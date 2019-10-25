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
        label: "Home & Kitchen",
        apiCat: "kitchenappliances",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/appliances.jpg"
    },
    {
        label: "Automobile Accessories",
        apiCat: "automobile",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/automobile.jpg"
    },
    {
        label: "Health and Beauty",
        apiCat: "healthandbeauty",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/health.jpg"
    },
    {
        label: "Stationary",
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
        label: "Electronics",
        apiCat: "electronics",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/laptop.jpg"
    },
    {
        label: "Hand Bags & Luggages",
        apiCat: "bags",
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
        label: "Hardware Tools",
        apiCat: "hardwaretools",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/hardware+tools.jpg"
    },
    {
        label: "Home Decor",
        apiCat: "homedecor",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/home+decor.jpg"
    },
    {
        label: "Jewellery",
        apiCat: "jewellery",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/jewellery.jpg"
    },
    {
        label: "Mobile Accessories",
        apiCat: "mobileaccessories",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/phone+accessories.jpg"
    },
    {
        label: "Toys & Sports",
        apiCat: "toysandsports",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/toy.jpg"
    },
    {
        label: "Travel",
        apiCat: "travel",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/travel.jpg"
    },
    {
        label: "Watches",
        apiCat: "watches",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/wrist-watch.jpg"
    },
    {
        label: "Baby Care",
        apiCat: "babycare",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/baby+care.jpg"
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
    },
    {
        label: "Home Furnitures",
        apiCat: "furnitures",
        icon:
            "https://lecp-product-images.s3.ap-south-1.amazonaws.com/communityicons/bedroom.jpg"
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
    }
];

router.get("/allCats", (req, res, next) => {
    return res.json(categories);
});

module.exports = router;
