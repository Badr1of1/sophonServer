const { Receipt, Customer } = require("../Models");

// get all receipts
const getAllReceipts = async (req, res) => {
  try {
    const companyId = req.params.id;
    const receipts = await Receipt.find({ companyId });
    res.status(201).send(receipts);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

// delete a receipt
const delReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndDelete(req.params.id);
    if (!receipt) {
      return res.status(404).send();
    }
    res.send(receipt);
  } catch (error) {
    res.status(500).send(error);
  }
};

const newReceipts = async (req, res) => {
  try {
    // Extract data from the form
    const { companyId, workerId, customerName, products, total } = req.body;

    // Find the customer by name
    const customer = await Customer.findOne({ name: customerName });

    // Check if customer is found
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Extract customer ID
    const customerId = customer._id;

    // Create detail array for receipt
    const detail = products.map((product) => ({
      date: new Date(),
      items: [
        {
          name: product.name,
          quantity: product.quantity,
          price: product.price,
        },
      ],
    }));

    // Create a new receipt instance
    const newReceipt = new Receipt({
      companyId,
      customerId,
      workerId,
      detail,
      total,
    });

    // Save the new receipt to the database
    const savedReceipt = await newReceipt.save();

    console.log("Receipt added successfully:", savedReceipt);
    return res.status(201).json(savedReceipt);
  } catch (error) {
    console.error("Error adding receipt:", error);
    return res
      .status(500)
      .json({ error: error.message || "An error occurred" });
  }
};


module.exports = {
  delReceipt,
  newReceipts,
  getAllReceipts,
};
