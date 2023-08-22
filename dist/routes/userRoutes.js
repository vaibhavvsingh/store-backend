"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const router = express_1.default.Router();
const JWT_KEY = process.env.JWT_KEY;
function loginUser(req, res) {
    const { username, password } = req.body;
    db_1.default.query("select * from `users` where `username`=?", [username], function (err, results, fields) {
        if (err) {
            return res.status(400).json({ message: "SQL Error" });
        }
        if (!results.length) {
            return res.status(404).json({ message: "User Not Found" });
        }
        bcrypt_1.default.compare(password, results[0].password, function (err, result) {
            if (err) {
                return res.status(500).json({ message: "Error occured" });
            }
            if (!result) {
                return res.status(401).json({ message: "Wrong Password" });
            }
            const token = jsonwebtoken_1.default.sign({ id: results[0].id }, JWT_KEY, {
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
    });
}
function addUser(req, res) {
    const { username, password, email, firstName, lastName } = req.body;
    if (password.length < 8) {
        res
            .status(400)
            .json({ message: "Password should be minimum 8 characters long." });
    }
    bcrypt_1.default.genSalt(10, function (err, salt) {
        bcrypt_1.default.hash(password, salt, function (err, hash) {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            db_1.default.query("insert into users (`username`, `password`, `email`, `first-name`, `last-name`) values (?,?,?,?,?)", [username, hash, email, firstName, lastName], function (err, results, fields) {
                if (err) {
                    if (err.code == "ER_DUP_ENTRY")
                        return res.status(400).json({
                            message: "User already exists! Try to Login instead.",
                        });
                    // console.log(err);
                    return res.status(400).json({ message: "SQL Error" });
                }
                res.json({ message: "User created successfully! Please Login Now." });
            });
        });
    });
}
function updateUser(req, res) {
    const { userid, username, password, email, firstName, lastName } = req.body;
    db_1.default.query("update users set `username`=?, `password`=?, `email`=?, `first-name`=?, `last-name`=? where id=?", [username, password, email, firstName, lastName, userid], function (err, results, fields) {
        if (err) {
            return res.json({ message: "SQL Error " });
        }
        res.json(results);
    });
}
function deleteUser(req, res) {
    const { userid } = req.body;
    db_1.default.query("DELETE FROM users WHERE id=?;", [userid], function (err, results, fields) {
        if (err) {
            return res.status(400).json({ message: "SQL Error" });
        }
        res.json(results);
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
router.route("/login").post(loginUser);
router.route("/register").post(addUser);
router.route("/logout").get(logoutUser);
router
    .route("/")
    .patch(authenticate_1.default, updateUser)
    .delete(authenticate_1.default, deleteUser);
exports.default = router;
