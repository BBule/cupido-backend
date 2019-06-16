const express = require("express");
const router = express.Router();

const User = require("../../models/user");

const mycomments = require("../../models/mycomments");

const myreplies = require("../../models/myreplies");

router.get("/get/:productid", async (req, res, next) => {
    let curruser = req.user;
    try {
        var comments = await mycomments
            .find({
                "Product.id": req.params.productid
            })
            .populate("User.id", "username")
            .lean()
            .exec();
        // const bars = comments.map(comment => {
        //     if (comment.upvotes.meta.indexOf(curruser._id) >= 0) {
        //         comment.user_upvoted = true;
        //         comment.down_upvoted = false;
        //     } else if (comment.downvotes.meta.indexOf(curruser._id) >= 0) {
        //         comment.user_upvoted = false;
        //         comment.down_upvoted = true;
        //     } else {
        //         comment.user_upvoted = false;
        //         comment.down_upvoted = false;
        //     }
        //     return comment;
        // });

        return res.send(comments);
    } catch (error) {
        return next({
            message: error.message || "Unknown error",
            status: 400,
            stack: error
        });
    }
});

router.get("/reply/:commentid", async (req, res) => {
    try {
        var replies = await myreplies
            .find({
                "Comment.id": req.params.commentid
            })
            .populate("User.id", "username")
            .exec();
        return res.send(replies);
    } catch (error) {
        return next({
            message: error.message || "Unknown error",
            status: 400,
            stack: error
        });
    }
});

module.exports = router;