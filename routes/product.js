const express = require("express");
const router = express.Router();
const {
  newProduct,
  getProducts,
  delProduct,
  updateProduct,
} = require("../controllers/product");

router.route("/product").post(newProduct);
router.route("/product/:id").patch(updateProduct).delete(delProduct);
router.route("/products/:companyId").get(getProducts);

module.exports = router;
