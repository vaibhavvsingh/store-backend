require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const PORT = process.env.PORT || 3000;
const app = express();
const db = require("./db");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: ["http://localhost:3000", "https://kicks-shoe-store.vercel.app"],
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

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
