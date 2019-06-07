const express = require("express");
const router = express.Router();

const {
    createCommitOrOrder,
    getUserCommits
} = require("../controller/commits.cont");

router.get("/", (req, res, next) => {
    const { type = true, skip = 0, limit = 10 } = req.query;
    return getUserCommits(req.user._id, type, limit, skip)
        .then(data => {
            return res.json(data);
        })
        .catch(error => {
            console.log(error);
            return next({
                stack: error,
                message: "unknown error occured",
                status: 400
            });
        });
});
router.post("/orderOrCommit", (req, res, next) => {
    const { wholeCart, addressId } = req.body;
    if (!wholeCart || !wholeCart.length) {
        return next({
            status: 400,
            message: "please pass all the cart item"
        });
    }
    createCommitOrOrder(wholeCart, addressId, req.user._id)
        .then(data => {
            return res.json(data);
        })
        .catch(error => {
            return next({
                status: 400,
                message: "Unknown error occured!",
                stack: error
            });
        });
});
module.exports = router;
