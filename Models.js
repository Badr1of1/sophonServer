const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  companyname: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  inventory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
    },
  ],
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
  workers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Worker" }]

});

const Company = mongoose.model("Company", CompanySchema);

const WorkerSchema = new mongoose.Schema({
  companyId : {type : mongoose.Schema.Types.ObjectId , ref : 'Company'},
  adminstatus : { type: Boolean, enum : [true, false], default: false},
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
});

const Worker = mongoose.model("Worker", WorkerSchema);

const InventorySchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  name: { type: String, required: true, unique: true },
  costprice: { type: Number, required: true },
  salesprice: { type: Number, required: true },
  onhand: { type: Number, required: true, default: 0 },
});

const Inventory = mongoose.model("Inventory", InventorySchema);

const CustomerSchema = new mongoose.Schema({
  belongsTo: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  company: { type: String, required: true , unique :  true},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone : {type : String, unique : true},
});

const Customer = mongoose.model("Customer", CustomerSchema);

const DebtSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "Workers" },
    customerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    debts: {
        date: {
          type: Date,
          required: true,
          default: Date.now,
        },
        amount: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
  },
  { timestamps: true }
);

const Debt = mongoose.model("Debt", DebtSchema);


const ReceiptSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref : "Company"},
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
    customerid: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    detail: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        items: [
          {
            name: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true },
          },
        ],
      },
    ],
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

const Receipt = mongoose.model("Receipt", ReceiptSchema);

module.exports = { Company, Worker, Inventory, Customer, Debt, Receipt };
