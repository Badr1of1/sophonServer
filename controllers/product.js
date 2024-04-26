const { Inventory } = require("../Models");

// add a new product
const newProduct = async (req, res) => {
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
};

// get all products in store
const getProducts = async (req, res) => {
  try {
    const { companyId } = req.params;
    const products = await Inventory.find({ companyId });
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).send(error);
  }
};

// edit a product
const updateProduct = async (req, res) => {
  try {
    const product = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).send();
    }
    res.status(201).json({ message: "Product Updated Successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};

// delete a product
const delProduct = async (req, res) => {
  try {
    const product = await Inventory.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  newProduct,
  delProduct,
  getProducts,
  updateProduct,
};
