const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated } = require("../controller/auth");
const { getToken, processPayment } = require("../controller/paymentB");
const { getUserById, pushOrderInPurchaseList } = require("../controller/user");
router.param("userId", getUserById);
router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);

router.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthenticated,
  processPayment
);

module.exports = router;
