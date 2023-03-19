const express=require('express');
const router=express.Router();
const {getUserById,pushOrderInPurchaseList}=require("../controller/user");
const {isSignedIn,isAuthenticated,isAdmin}=require("../controller/auth");
const {updateStock}=require("../controller/product");

const {getOrderById,createOrder,getorderStatus,updateStatus,getAllOrders}=require("../controller/order");

//params
router.param("userId",getUserById);
router.param("orderId",getOrderById);



//actual routes


//create
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStock,createOrder);

//read
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders)


//status of order
router.get("order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getorderStatus);
router.put("order/:orderId/:userId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)
module.exports=router;
