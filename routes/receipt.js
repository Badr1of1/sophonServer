const express = require("express");
const router = express.Router();

const {
  getAllReceipts,
  newReceipts,
  delReceipt,
} = require("../controllers/receipt");


router.route("/receipt").post(newReceipts)
router.route("/receipt:id").delete(delReceipt)
router.route("/receipts:companyId").get(getAllReceipts)

module.exports = router