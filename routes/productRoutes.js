const express = require("express");
const router = express.Router();
const db = require("../db");
const adminKey = process.env.ADMIN_KEY;

function getProducts(req, res) {
  let queryString;
  if (!req.body) {
    queryString = "select * from products";
  } else {
    queryString = "select * from products where id=" + req.body.id;
  }
  db.query(queryString, function (err, results, fields) {
    if (err) {
      return res.json({ message: err.message });
    }
    if (results.length == 0) {
      return res.json({ message: "No Product Found" });
    }
    res.json(results);
  });
}

function addProduct(req, res) {
  const { name, brand, desc, sizes, img, adminToken } = req.body;
  if (adminToken !== adminKey) return res.json({ message: "Not Authorized" });
  db.query(
    "insert into products (name, brand, desc, sizes, img) values (?,?,?,?,?)",
    [name, brand, desc, sizes, img],
    function (err, results, fields) {
      if (err) {
        return res.json({ message: err.message });
      }
      res.json(results);
    }
  );
}

function updateProduct(req, res) {
  const { id, name, brand, desc, sizes, img, adminToken } = req.body;
  if (adminToken !== adminKey) return res.json({ message: "Not Authorized" });
  db.query(
    "update products set `name`=?, `brand`=?, `desc`=?, `sizes`=?, `img`=? where id=?",
    [name, brand, desc, sizes, img, id],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.json({ message: "SQL Error " + err.message });
      }
      console.log(results);
      res.json(results);
    }
  );
}

function deleteProduct(req, res) {
  const { id, adminToken } = req.body;
  if (adminToken !== adminKey) return res.json({ message: "Not Authorized" });
  db.query(
    "DELETE FROM products WHERE id=?;",
    [id],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.json({ message: "SQL Error " + err.message });
      }
      console.log(results);
      res.json(results);
    }
  );
}

router
  .route("/")
  .get(getProducts)
  .post(addProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
