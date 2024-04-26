require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const server = http.createServer(app);
const PORT = process.env.PORT || 3001; // Added a default port in case the environment variable is not set

const customer = require("./routes/customer");
const product = require("./routes/product");
const receipt = require("./routes/receipt");
const {login, register} = require("./controllers/user")

app.use("/api", customer, product, receipt);
app.post("/register", register)
app.post("/login", login)

mongoose.connect("mongodb://127.0.0.1:27017/sophon"); 

// Added options to avoid deprecation warnings
const db = mongoose.connection;
db.on("error", console.error.bind(console, "error connecting to the database"));
db.once("open", function () {
  console.log("Connected to the database");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

// server.listen()
server.listen(
  PORT,
  () => console.log(`Server is running on http://localhost:${PORT}`) // Changed the hardcoded port to the PORT variable
);
