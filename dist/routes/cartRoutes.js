"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const router = express_1.default.Router();
function getCartItems(req, res) {
    const { userid } = req.query;
    db_1.default.query("select c.id, `productid`, `userid`, `quantity`, `name`, brand, `desc`, sizes, img, price, category from store.cart c inner join store.products p on c.productid = p.id where c.userid=?", [userid], function (err, results, fields) {
        if (err) {
            return res.status(500).json({ message: "SQL Error" });
        }
        res.json(results);
    });
}
function addCartItem(req, res) {
    const { userid, productid, quantity } = req.body;
    db_1.default.query("select * from cart where userid=? and productid=?", [userid, productid], function (err, results1, fields) {
        if (err) {
            return res.json({ message: "SQL Error" });
        }
        if (results1.length === 0) {
            db_1.default.query("insert into cart (userid, productid, quantity) values (?,?,?)", [userid, productid, quantity], function (err, results, fields) {
                if (err) {
                    return res.json({ message: "SQL Error" });
                }
                res.json({ message: "Added Item to Cart" });
            });
        }
        else {
            db_1.default.query("update cart set quantity=? where id=?", [quantity, results1[0].id], function (err, results, fields) {
                if (err) {
                    return res.json({ message: "SQL Error" });
                }
                res.json({ message: "Cart Updated" });
            });
        }
    });
}
function deleteCartItem(req, res) {
    const { id } = req.body;
    db_1.default.query("delete from cart where id=?", [id], function (err, results, fields) {
        if (err) {
            return res.status(500).json({ message: "SQL Error" });
        }
        res.json({ message: "Deleted Cart Item" });
    });
}
function deleteAllItems(req, res) {
    const { userid } = req.body;
    db_1.default.query("delete from cart where userid = ?", [userid], function (err, results, fields) {
        if (err) {
            return res.status(500).json({ message: "SQL Error" });
        }
        res.json({ message: "Emptied Cart" });
    });
}
router
    .use(authenticate_1.default)
    .route("/")
    .get(getCartItems)
    .post(addCartItem)
    .delete(deleteCartItem);
router.use(authenticate_1.default).route("/all").delete(deleteAllItems);
exports.default = router;
