require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const wishlistRouter = require("./routes/wishlistRoutes");
const PORT = process.env.PORT || 3000;
const app = express();
const db = require("./db");
const cookieParser = require("cookie-parser");

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
  data.forEach((element) => {
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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
