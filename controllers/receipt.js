const { Receipt } = require("../Models");

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

// add new receipts
const newReceipts = async (req, res) => {
  try {
    const receipt = new Receipt(req.body);
    await receipt.save();
    res.status(201).send(receipt);
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

module.exports = {
  delReceipt,
  newReceipts,
  getAllReceipts,
};
