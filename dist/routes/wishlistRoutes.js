"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const router = express_1.default.Router();
function getWishlistItems(req, res) {
    const { userid } = req.query;
    db_1.default.query("select idwishlist, `productid`, `userid`, `name`, brand, `desc`, sizes, img, price, category from store.wishlist w inner join store.products p on w.productid = p.id where w.userid=?", [userid], function (err, results, fields) {
        if (err) {
            return res.json({ message: "SQL Error" });
        }
        res.json(results);
    });
}
function addWishlistItem(req, res) {
    const { userid, productid } = req.body;
    db_1.default.query("select * from wishlist where userid=? and productid=?", [userid, productid], function (err, results1, fields) {
        if (err) {
            return res.json({ message: "SQL Error" });
        }
        if (results1.length === 0) {
            db_1.default.query("insert into wishlist (userid, productid) values (?,?)", [userid, productid], function (err, results, fields) {
                if (err) {
                    return res.json({ message: "SQL Error" });
                }
                res.json({ message: "Added Item to Wishlist" });
            });
        }
        else {
            res.status(400).json({ message: "Product already exists in Wishlist" });
        }
    });
}
function deleteWishlistItem(req, res) {
    const { id } = req.body;
    db_1.default.query("delete from wishlist where idwishlist=?", [id], function (err, results, fields) {
        if (err) {
            return res.json({ message: "SQL Error" });
        }
        res.json({ message: "Deleted Wishlist Item" });
    });
}
router
    .use(authenticate_1.default)
    .route("/")
    .get(getWishlistItems)
    .post(addWishlistItem)
    .delete(deleteWishlistItem);
exports.default = router;
