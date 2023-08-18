const express = require("express");
const router = express.Router();
const db = require("../db");
const adminKey = process.env.ADMIN_KEY;

function getProducts(req, res) {
  const { id, page, search } = req.query;
  let queryString = "select * from products";
  if (id) {
    queryString = queryString + " where id=" + id;
  } else if (page) {
    if (search && search !== "")
      queryString = queryString + ` where \`name\` like '%${search}%'`;
    if (page < 1)
      return res.status(400).json({ message: "Invalid Page Number" });
    queryString = queryString + ` limit 12 offset ${12 * (page - 1)}`;
  }
  db.query(queryString, function (err, results, fields) {
    if (err) return res.json({ message: err.message });

    if (!results.length)
      return res.status(404).json({ message: "No products found" });
    res.json(results);
  });
}

function addProduct(req, res) {
  const { name, brand, desc, price, sizes, img, adminToken } = req.body;
  if (adminToken !== adminKey) return res.json({ message: "Not Authorized" });
  db.query(
    "insert into products (`name`, brand, `desc`, price, sizes, img) values (?,?,?,?,?,?)",
    [name, brand, desc, price, sizes, img],
    function (err, results, fields) {
      if (err) {
        return res.json({ message: err.message });
      }
      res.json(results);
    }
  );
}

function updateProduct(req, res) {
  const { id, name, brand, desc, price, sizes, img, adminToken } = req.body;
  if (adminToken !== adminKey) return res.json({ message: "Not Authorized" });
  db.query(
    "update products set `name`=?, `brand`=?, `desc`=?, price=? `sizes`=?, `img`=? where id=?",
    [name, brand, desc, price, sizes, img, id],
    function (err, results, fields) {
      if (err) {
        return res.json({ message: "SQL Error " + err.message });
      }
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
        return res.json({ message: "SQL Error " + err.message });
      }
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
