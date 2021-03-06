require("dotenv").config();
const express = require("express"),
  mongoose = require("mongoose");
const cors = require("cors");
const app = express(),
  PORT = 5000;

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const menuRouter = require("./routes/menu");

app.use("/", userRouter);
app.use("/posts", blogRouter);
app.use("/menus", menuRouter);

app.get("/", (req, res) => {
  res.send("API LANDING PAGE");
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
