import "dotenv/config";
import express from "express";
import Razorpay from 'razorpay'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import productRouter from "./routes/productRoutes";
import userRouter from "./routes/userRoutes";
import cartRouter from "./routes/cartRoutes";
import wishlistRouter from "./routes/wishlistRoutes";
import db from './db'
import authenticate from "./middlewares/authenticate";

const PORT = process.env.PORT || 3000;
const app = express();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID as string,
  key_secret: process.env.RAZORPAY_SECRET as string,
});

app.use(
  "*",
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());

db.connect((err) => {
  if (err) throw err;
  console.log("Database Connected");
});

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);

app.post("/products", (req, res) => {
  const { data } = req.body;
  const sizes = "[7,8,9,10,11,12,13]";
  const desc = "Hello World";
  data.forEach((element:any) => {
    const { name, brand, price, img } = element;
    db.query(
      "insert into products (`name`, brand, `desc`, price, sizes, img) values (?,?,?,?,?,?)",
      [name, brand, desc, price, sizes, img],
      function (err, results, fields) {
        if (err) {
          return res.json({ message: err.message });
        }
      }
    );
  });
  res.json({ message: "data added" });
});

app.post("/razorpay", authenticate, async (req, res) => {
  try {
    const response = await razorpay.orders.create({
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
  } catch (err) {
    console.log(err);
  }
});

app.get("/", (req, res) => {
  res.send("Hey there! Welcome to the backend of shoe store");
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
