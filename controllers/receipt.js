const { Receipt, Customer } = require("../Models");

// function to send aesthetic data to the frontend
const getReceipts = async (companyId) => {
  try {
    const receipts = await Receipt.find({companyId})
      .populate("workerId")
      .populate("customerId");
    return receipts.map((receipt) => {
      return {
        _id: receipt._id,
        companyId: receipt.companyId,
        workerName: receipt.workerId.name, // Assuming the worker document has a 'name' field
        customerName: receipt.customerId.name,
        detail: receipt.detail,
        total: receipt.total,
      };
    });
  } catch (error) {
    console.error("Error fetching receipts:", error);
    throw error;
  }
};


// get all receipts
const getAllReceipts = async (req, res) => {
  try {
    const receipts = await getReceipts(req.params.companyId) 
    res.status(201).send(receipts);
  } catch (error) {
    res.status(400).send(error);
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

    // Create a new receipt instance
    const newReceipt = new Receipt({
      companyId,
      customerId,
      workerId,
      detail : products,
      total,
    });

    // Save the new receipt to the database
    const savedReceipt = await newReceipt.save();
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
