const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const authenticate = require("../middlewares/authenticate");

function loginUser(req, res) {
  const { username, password } = req.body;
  db.query(
    "select * from `users` where `username`=?",
    [username],
    function (err, results, fields) {
      if (err) {
        return res.status(400).json({ message: "SQL Error" });
      }
      if (!results.length) {
        return res.status(404).json({ message: "User Not Found" });
      }
      bcrypt.compare(password, results[0].password, function (err, result) {
        if (err) {
          return res.status(500).json({ message: "Error occured" });
        }
        if (!result) {
          return res.status(401).json({ message: "Wrong Password" });
        }
        const token = jwt.sign({ id: results[0].id }, process.env.JWT_KEY, {
          expiresIn: "7d",
        });
        res
          .cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .json({ userid: results[0].id, message: "User Logged In" });
      });
    }
  );
}
function addUser(req, res) {
  const { username, password, email, firstName, lastName } = req.body;
  if (password.length < 8) {
    res
      .status(400)
      .json({ message: "Password should be minimum 8 characters long." });
  }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      db.query(
        "insert into users (`username`, `password`, `email`, `first-name`, `last-name`) values (?,?,?,?,?)",
        [username, hash, email, firstName, lastName],
        function (err, results, fields) {
          if (err) {
            if (err.code == "ER_DUP_ENTRY")
              return res.status(400).json({
                message: "User already exists! Try to Login instead.",
              });
            // console.log(err);
            return res.status(400).json({ message: "SQL Error" });
          }
          res.json({ message: "User created successfully! Please Login Now." });
        }
      );
    });
  });
}

function updateUser(req, res) {
  const { userid, username, password, email, firstName, lastName } = req.body;
  db.query(
    "update users set `username`=?, `password`=?, `email`=?, `first-name`=?, `last-name`=? where id=?",
    [username, password, email, firstName, lastName, userid],
    function (err, results, fields) {
      if (err) {
        return res.json({ message: "SQL Error " });
      }
      res.json(results);
    }
  );
}

function deleteUser(req, res) {
  const { userid } = req.body;
  db.query(
    "DELETE FROM users WHERE id=?;",
    [userid],
    function (err, results, fields) {
      if (err) {
        return res.status(400).json({ message: "SQL Error" });
      }
      res.json(results);
    }
  );
}

function logoutUser(req, res) {
  res
    .clearCookie("acces_token", {
      sameSite: "none",
      secure: true,
    })
    .json({ message: "User has been logged out" });
}

router.route("/login").post(loginUser);

router.route("/register").post(addUser);

router.route("/logout").get(logoutUser);

router
  .route("/")
  .patch(authenticate, updateUser)
  .delete(authenticate, deleteUser);

module.exports = router;
