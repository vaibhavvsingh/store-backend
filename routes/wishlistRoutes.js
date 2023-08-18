const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db");
const authenticate = require("../middlewares/authenticate");

function getWishlistItems(req, res) {
  const { userid } = req.query;
  db.query(
    "select idwishlist, `productid`, `userid`, `name`, brand, `desc`, sizes, img, price, category from store.wishlist w inner join store.products p on w.productid = p.id where w.userid=?",
    [userid],
    function (err, results, fields) {
      if (err) {
        return res.json({ message: "SQL Error" });
      }
      res.json(results);
    }
  );
}

function addWishlistItem(req, res) {
  const { userid, productid } = req.body;
  db.query(
    "select * from wishlist where userid=? and productid=?",
    [userid, productid],
    function (err, results1, fields) {
      if (err) {
        return res.json({ message: "SQL Error" });
      }
      if (results1.length === 0) {
        db.query(
          "insert into wishlist (userid, productid) values (?,?)",
          [userid, productid],
          function (err, results, fields) {
            if (err) {
              return res.json({ message: "SQL Error" });
            }
            res.json({ message: "Added Item to Wishlist" });
          }
        );
      } else {
        res.status(400).json({ message: "Product already exists in Wishlist" });
      }
    }
  );
}

function deleteWishlistItem(req, res) {
  const { id } = req.body;
  db.query(
    "delete from wishlist where idwishlist=?",
    [id],
    function (err, results, fields) {
      if (err) {
        return res.json({ message: "SQL Error" });
      }
      res.json({ message: "Deleted Wishlist Item" });
    }
  );
}

router
  .use(authenticate)
  .route("/")
  .get(getWishlistItems)
  .post(addWishlistItem)
  .delete(deleteWishlistItem);

module.exports = router;
