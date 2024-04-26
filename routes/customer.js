const express = require("express");
const router = express.Router();
const {
  getAllCustomers,
  updaterCustomer,
  newCustomer,
  delCustomer,
  addWorker,
} = require("../controllers/customer");

router.route("/worker").post(addWorker);
router.route("/customer").post(newCustomer);
router.route("/customer/:id").patch(updaterCustomer).delete(delCustomer);
router.route("/customers/:companyId").get(getAllCustomers);


module.exports = router