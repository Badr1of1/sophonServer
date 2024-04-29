const { Customer } = require("../Models");

// Add workers or users of the system
const addWorker = async (req, res) => {
  try {
    const existingWorker = await Worker.find({ name: req.body.name });
    if (existingWorker.length > 0) {
      return res.status(400).json({ message: "Worker already exists" });
    }
    const worker = new Worker(req.body);
    await worker.save();
    res.status(201).send(worker);
  } catch (error) {
    res.status(400).send(error);
  }
};

// add a new customer
const newCustomer = async (req, res) => {
  try {
    const existingCustomer = await Customer.find({ name: req.body.name });
    const existingPhone = await Customer.find({ phone: req.body.phone });
    const existingCompany = await Customer.find({ company: req.body.company });
    const existingEmail = await Customer.find({ email: req.body.email });
    if (existingCustomer.length > 0) {
      return res.status(400).json({ message: "Customer already exists" });
    }else if (existingPhone.length > 0) {
      return res.status(400).json({ message: "Phone number already registered" });
    }else if (existingCompany.length > 0) {
      return res.status(400).json({ message: "Company name exists" });
    }else if (existingEmail.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// get all customers in a company
const getAllCustomers = async (req, res) => {
  try {
    const { companyId } = req.params;
    const customers = await Customer.find({ belongsTo: companyId });
    res.status(200).json({ customers });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// edit a customer
const updaterCustomer = async (req, res) => {
  try {
    const existingCustomer = await Customer.findById({ _id: req.params.id });
    if (!existingCustomer) {
      return res.status(400).json({ message: "Customer not found" });
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

// delete a customer
const delCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  newCustomer,
  delCustomer,
  getAllCustomers,
  updaterCustomer,
  addWorker,
};
