const BlogPost = require("../models/BlogPost");

const getBlogPosts = async (page = 1, limit = 10, sortByPopularity = false) => {
    let sortQuery = { createdAt: -1 };
    if (sortByPopularity) {
        sortQuery["popularity_hits"] = -1;
    }
    const allPosts = await BlogPost.find()
        .select({
            topic: 1,
            title: 1,
            time_to_read: 1,
            author: 1,
            createdAt: 1,
            body: 1
        })
        .sort(sortQuery)
        .skip(limit * (page - 1))
        .limit(limit * (page - 1) + limit)
        .exec();
    const totalPostCount = await BlogPost.countDocuments().exec();
    return {
        currentPage: page,
        maxPage: Math.ceil(totalPostCount / limit),
        data: allPosts
    };
};
const getBlogPostById = async id => {
    return await BlogPost.findOne({ _id: id }).exec();
};

module.exports = { getBlogPosts, getBlogPostById };
