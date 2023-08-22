"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const razorpay_1 = __importDefault(require("razorpay"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const wishlistRoutes_1 = __importDefault(require("./routes/wishlistRoutes"));
const db_1 = __importDefault(require("./db"));
const authenticate_1 = __importDefault(require("./middlewares/authenticate"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
const razorpay = new razorpay_1.default({
    key_id: "rzp_test_cQBOooxXHP2UNA",
    key_secret: "9hygpd65u4kYOvANu2YSAbf9",
});
app.use("*", (0, cors_1.default)({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
db_1.default.connect((err) => {
    if (err)
        throw err;
    console.log("Database Connected");
});
app.use("/user", userRoutes_1.default);
app.use("/product", productRoutes_1.default);
app.use("/cart", cartRoutes_1.default);
app.use("/wishlist", wishlistRoutes_1.default);
app.post("/products", (req, res) => {
    const { data } = req.body;
    const sizes = "[7,8,9,10,11,12,13]";
    const desc = "Hello World";
    data.forEach((element) => {
        const { name, brand, price, img } = element;
        db_1.default.query("insert into products (`name`, brand, `desc`, price, sizes, img) values (?,?,?,?,?,?)", [name, brand, desc, price, sizes, img], function (err, results, fields) {
            if (err) {
                return res.json({ message: err.message });
            }
        });
    });
    res.json({ message: "data added" });
});
app.post("/razorpay", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield razorpay.orders.create({
            amount: 500 * 100,
            currency: "INR",
            receipt: Date.now().toString(),
            partial_payment: true,
        });
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    }
    catch (err) {
        console.log(err);
    }
}));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.listen(PORT, () => console.log("Server running on port " + PORT));
