"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_KEY = process.env.JWT_KEY;
function authenticate(req, res, next) {
    var _a;
    let { userid } = req.query;
    if (!userid)
        userid = req.body.userid;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
    jsonwebtoken_1.default.verify(token, JWT_KEY, (err, userInfo) => {
        if (err)
            res.status(400).json({ message: "Token not valid" });
        if ((userInfo === null || userInfo === void 0 ? void 0 : userInfo.id) != userid) {
            return res.status(401).json({ message: "Not authorized" });
        }
        next();
    });
}
exports.default = authenticate;
