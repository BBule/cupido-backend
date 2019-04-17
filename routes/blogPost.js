const express = require("express");
const router = express.Router();
const authenticate = require(".././middleware/authenticate");

const BlogPostCont = require("../controller/blogPost.cont");

router.get("/api/blogposts", authenticate, (req, res, next) => {
    const { page = 1, limit = 10, popularity = false } = req.query;
    return BlogPostCont.getBlogPosts(page, limit, popularity)
        .then(data => {
            return res.json(data);
        })
        .catch(error => {
            return next({
                message:
                    error.message || "unable to fetch blogs,please try again!",
                status: 400
            });
        });
});

router.get("/api/blogposts/:id", (req, res, next) => {
    return BlogPostCont.getBlogPostById(req.params.id)
        .then(data => {
            return res.json(data);
        })
        .catch(error => {
            return next({
                message:
                    error.message || "unable to fetch blogs,please try again!",
                status: 400
            });
        });
});

module.exports = router;
