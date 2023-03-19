var express=require('express');
var router=express.Router();
const {signout,signup,signin,isSignedIn}=require("../controller/auth");
const {check,validationResult}=require('express-validator');
//route for signup checks validation for name,pswd and email
router.post("/signup",[
    check("name").isLength({min:3,max:300}).withMessage("Name should be atleast of 3 characters"),
    check("password").isLength({min:8,max:15}).withMessage("Password must be atleast of 8 characters"),
    check("email").isEmail().withMessage("Email is not valid")

],signup);
//route for signin will validate pswd and email 
router.post("/signin",[
    check("email").isEmail().withMessage("Email field is required"),
    check("password").isLength({min:8,max:15}).withMessage("Password field is required")


],signin);
//route for signout
router.get("/signout",signout);
router.get("/testroute",isSignedIn,(req,res) => {
    res.json(req.auth);
});
module.exports=router;
