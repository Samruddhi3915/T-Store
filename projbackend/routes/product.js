const express=require('express');
const router=express.Router();


const {getProductById,createProduct,getAllUniqueCategories,getAllProducts,getProduct,photo,deleteProduct,updateProduct}=require("../controller/product");
const {getUserById}=require("../controller/user");
const {isSignedIn,isAuthenticated,isAdmin}=require("../controller/auth");

//all of params
router.param("userId",getUserById);
router.param("productId",getProductById);
 

//actual routes
//create route
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);
//read route
router.get("/product/:productId",getProduct)
router.get("/product/photo/:productId",photo)

//delete route
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct)

//update route
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct)

//listing route
router.get("/products",getAllProducts)
router.get("/product/categories",getAllUniqueCategories)


module.exports=router;