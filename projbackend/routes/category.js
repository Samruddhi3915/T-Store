const express=require("express");
const router=express.Router();
const {getCategoryById,getAllCategory,getCategory,createCategory,DeleteCategory,UpdateCategory} =require("../controller/category");
const {isSignedIn,isAdmin,isAuthenticated} =require("../controller/auth");
const {getUserById} =require("../controller/user");
//params
router.param("userId",getUserById);
router.param("categoryId",getCategoryById)

//actual routes goes here
//create routes
router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory);



//read routes
router.get("/category/:categoryId",getCategory);
router.get("/categories",getAllCategory);


//update routes
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,UpdateCategory);

//delete

router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,DeleteCategory);

module.exports=router;