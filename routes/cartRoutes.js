const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db");

function getCartItems(req, res) {
  const { userid } = req.body;
  const token = req.cookies?.access_token;
  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err || userInfo.id !== userid) {
      return res.status(401).json({ message: "Not authorized" });
    }
    db.query(
      "select * from cart where userid=?",
      [userid],
      function (err, results, fields) {
        if (err) {
          return res.json({ message: err.message });
        }
        res.json(results);
      }
    );
  });
}
function addCartItem(req, res) {
  const { userid, productid, quantity } = req.body;
  const token = req.cookies?.access_token;
  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err || userInfo.id !== userid) {
      return res.status(401).json({ message: "Not authorized" });
    }
    db.query(
      "insert into cart (userid, productid, quantity) values (?,?,?)",
      [userid, productid, quantity],
      function (err, results, fields) {
        if (err) {
          return res.json({ message: err.message });
        }
        res.json(results);
      }
    );
  });
}
function updateCartItem(req, res) {
  const { id, quantity, userid } = req.body;
  const token = req.cookies?.access_token;
  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err || userInfo.id !== userid) {
      return res.status(401).json({ message: "Not authorized" });
    }
    db.query(
      "update cart set quantity=? where id=?",
      [quantity, id],
      function (err, results, fields) {
        if (err) {
          return res.json({ message: err.message });
        }
        res.json(results);
      }
    );
  });
}
function deleteCartItem(req, res) {
  const { id, userid } = req.body;
  const token = req.cookies?.access_token;
  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err || userInfo.id !== userid) {
      return res.status(401).json({ message: "Not authorized" });
    }
    db.query(
      "delete from cart where id=?",
      [id],
      function (err, results, fields) {
        if (err) {
          return res.json({ message: err.message });
        }
        res.json(results);
      }
    );
  });
}

router
  .route("/")
  .get(getCartItems)
  .post(addCartItem)
  .patch(updateCartItem)
  .delete(deleteCartItem);

module.exports = router;
