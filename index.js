require("dotenv").config();
const productRouter = require("./routes")
const express = require("express");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Company, Worker } = require("./Models")

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const server = http.createServer(app);
const PORT = process.env.PORT || 3000; // Added a default port in case the environment variable is not set

// Router connecting to the product
app.use("/api", productRouter);

mongoose.connect("mongodb://127.0.0.1:27017/sophon"); // Added options to avoid deprecation warnings
const db = mongoose.connection;
db.on("error", console.error.bind(console, "error connecting to the database"));
db.once("open", function () {
  console.log("Connected to the database");
});


app.post("/register", async (req, res) => {
  try {
    const { companyname, email, password } = req.body;
    const existingCompany = await Company.findOne({ companyname });
    const existingEmail = await Company.findOne({ email });

    if (existingCompany || existingEmail) {
      return res
        .status(400)
        .json({ message: "Company or Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createCompany = await Company.create({
      companyname,
      email,
      password: hashedPassword,
    });

    const adminstatus = true;
    const firstname = "Admin";
    const lastname = "Admin";
    const pass = "Admin";
    const createAdmin = await Worker.create({
      adminstatus,
      firstname,
      lastname,
      password: pass,
    });

    // Add the worker's ID to the company's workers field
    createCompany.workers.push(createAdmin._id);
    await createCompany.save();

    res
      .status(200)
      .send(createAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { companyname, password } = req.body;
    const company = await Company.findOne({ companyname }).populate(
      "inventory"
    ).populate(
      "workers"
    ).populate(
      "customers"
    );
    
    if (!company) {
      return res.status(401).json({ message: "Company doesn't exist" });
    }
    
    const passwordMatch = await bcrypt.compare(password, company.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Fetch the company's inventory
    const companydata = {
      id : company._id,
      name: company.companyname,
      email : company.email,
      products: company.inventory,
      customers: company.customers,
      workers: company.workers,
      
    };

    res.status(200).json({
      token, 
      companydata,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




app.get("/", (req, res) => {
  res.send("Hello World");
});

// server.listen()
server.listen(
  PORT,
  () => console.log(`Server is running on http://localhost:${PORT}`) // Changed the hardcoded port to the PORT variable
);
