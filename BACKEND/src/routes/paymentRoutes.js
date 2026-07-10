const express = require("express");

const router = express.Router();

const { createOrder ,verifyPayment} = require("../controllers/paymentController");

const {auth} = require("../middlewares/auth.middleware");


router.post("/create-order", auth, createOrder);
router.post("/verify-payment", auth, verifyPayment);

module.exports = router;