const { Company, Worker } = require("../Models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { companyname, password } = req.body;
  try {
    const company = await Company.findOne({ companyname })
      .populate("inventory")
      .populate("workers")
      .populate("customers");

    if (!company) {
      return res.status(401).json({ message: "Company does not exist" });
    }
    const passwordMatch = await bcrypt.compare(password, company.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // generate token
    const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      // only send cookie over HTTPS in production
      secure: process.env.NODE_ENV === "production",
      // 30 days expiration
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const companydata = {
      id: company._id,
      name: company.companyname,
      email: company.email,
      products: company.inventory,
      customers: company.customers,
      workers: company.workers,
    };

    res.status(200).json({
      token,
      companydata,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const register = async (req, res) => {
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

    res.status(200).send(createAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { login, register };
