const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db");

function getUser(req, res) {
  const { username, password } = req.body;
  db.query(
    "select * from `users` where `username`=?",
    [username],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.json({ message: "SQL Error " + err.message });
      }
      if (!results?.length) {
        return res.json({ message: "User Not Found" });
      }
      if (!results[0].password === password) {
        return res.json({ message: "Wrong Password" });
      }
      const token = jwt.sign({ id: results[0].id }, process.env.JWT_KEY);
      res.cookie("access_token", token, { httpOnly: true }).json(results[0]);
    }
  );
}
function addUser(req, res) {
  const { username, password, email, firstName, lastName } = req.body;
  db.query(
    "insert into users (`username`, `password`, `email`, `first-name`, `last-name`) values (?,?,?,?,?)",
    [username, password, email, firstName, lastName],
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

function updateUser(req, res) {
  const { id, username, password, email, firstName, lastName } = req.body;
  const token = req.cookies?.access_token;
  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (userInfo.id !== id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    db.query(
      "update users set `username`=?, `password`=?, `email`=?, `first-name`=?, `last-name`=? where id=?",
      [username, password, email, firstName, lastName, id],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return res.json({ message: "SQL Error " + err.message });
        }
        console.log(results);
        res.json(results);
      }
    );
  });
}

function deleteUser(req, res) {
  const { username } = req.body;
  const token = req.cookies?.access_token;
  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (userInfo.id !== id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    db.query(
      "DELETE FROM users WHERE username=?;",
      [username],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return res.json({ message: "SQL Error " + err.message });
        }
        console.log(results);
        res.json(results);
      }
    );
  });
}

function logoutUser(req, res) {
  res
    .clearCookie("acces_token", {
      sameSite: "none",
      secure: true,
    })
    .json({ message: "User has been logged out" });
}

router
  .route("/")
  .get(getUser)
  .post(addUser)
  .patch(updateUser)
  .delete(deleteUser);

router.route("/logout").get(logoutUser);

module.exports = router;
