const express = require("express");
const router = express.Router();
const { Inventory, Receipt, Customer, Worker } = require("./Models");



// Add workers or users of the system
router.post("/workers", async (req, res) => {
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
});

// Add a new product
router.post("/product", async (req, res) => {
  try {
    const companyId = req.body.companyId;
    if (!companyId) {
      return res.status(404).json({ message: "Company not registered" });
    }
    const existingProduct = await Inventory.find({ name: req.body.name });
    if (existingProduct.length > 0) {
      return res.status(400).json({ message: "Product already exists" });
    }
    const product = new Inventory(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// get all products in store
router.get('/products/:companyId', async (req, res) => {
  try {
    const {companyId} = req.params
    const products = await Inventory.find( {companyId})
    res.status(200).json({products})
  } catch (error) {
    res.status(400).send(error)
  }
})


// Edit a product
router.patch("/product/:id", async (req, res) => {
  try {
    const product = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).send();
    } 
    res.status(201).json({ message : "Product Deleted Successfully"});
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a product
router.delete("/product/:id", async (req, res) => {
  try {
    const product = await Inventory.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});



// ROUTES FOR THE CUSTOMER


// Add a new customer
router.post("/customer", async (req, res) => {
  try {
    const existingCustomer = await Customer.find({ name: req.body.name });
    const existingEmail = await Customer.find({ email: req.body.email });
    const existingCompany = await Customer.find({ phone: req.body.phone });
    if (existingCustomer.length > 0) {
      return res.status(400).json({ message: "Customer already exists" });
    }else if (existingEmail.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }else if (existingCompany.length > 0) {
      return res.status(400).json({ message: "Company already exists" });
    }
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// get all customers in a company
router.get('/customers/:companyId', async (req, res) => {
  try {
    const {companyId} = req.params
    const customers = await Customer.find( {belongsTo : companyId})
    res.status(200).json({customers})
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
})

// Edit a customer
router.patch("/customer/:id", async (req, res) => {
  try {
    const existingCustomer = await Customer.findById({_id : req.params.id})
    if (!existingCustomer) {
      return res.status(400).json({message : "Customer not found"})
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
    console.log(error)
  } 
});

// Delete a customer
router.delete("/customer/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
});



// Add a new receipt
router.get("/receipts/:companyId", async (req, res) => {
  try {
    const companyId = req.params.id
    const receipts = await Receipt.find({ companyId })
    res.status(201).send(receipts);
  } catch (error) {
    res.status(400).send(error);
    console.log(error)
  }
});
// Add a new receipt
router.post("/receipt", async (req, res) => {
  try {
    const receipt = new Receipt(req.body);
    await receipt.save();
    res.status(201).send(receipt);
  } catch (error) {
    res.status(400).send(error);
    console.log(error)
  }
});

// Delete a receipt
router.delete("/receipt/:id", async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndDelete(req.params.id);
    if (!receipt) {
      return res.status(404).send();
    }
    res.send(receipt);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;
