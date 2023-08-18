const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db");
const authenticate = require("../middlewares/authenticate");

function getCartItems(req, res) {
  const { userid } = req.query;
  db.query(
    "select c.id, `productid`, `userid`, `quantity`, `name`, brand, `desc`, sizes, img, price, category from store.cart c inner join store.products p on c.productid = p.id where c.userid=?",
    [userid],
    function (err, results, fields) {
      if (err) {
        return res.json({ message: "SQL Error" });
      }
      res.json(results);
    }
  );
}
function addCartItem(req, res) {
  const { userid, productid, quantity } = req.body;
  db.query(
    "select * from cart where userid=? and productid=?",
    [userid, productid],
    function (err, results1, fields) {
      if (err) {
        return res.json({ message: "SQL Error" });
      }
      if (results1.length === 0) {
        db.query(
          "insert into cart (userid, productid, quantity) values (?,?,?)",
          [userid, productid, quantity],
          function (err, results, fields) {
            if (err) {
              return res.json({ message: "SQL Error" });
            }
            res.json({ message: "Added Item to Cart" });
          }
        );
      } else {
        db.query(
          "update cart set quantity=? where id=?",
          [quantity, results1[0].id],
          function (err, results, fields) {
            if (err) {
              return res.json({ message: "SQL Error" });
            }
            res.json({ message: "Cart Updated" });
          }
        );
      }
    }
  );
}

function deleteCartItem(req, res) {
  const { id } = req.body;
  db.query(
    "delete from cart where id=?",
    [id],
    function (err, results, fields) {
      if (err) {
        return res.json({ message: "SQL Error" });
      }
      res.json({ message: "Deleted Cart Item" });
    }
  );
}

router
  .use(authenticate)
  .route("/")
  .get(getCartItems)
  .post(addCartItem)
  .delete(deleteCartItem);

module.exports = router;
