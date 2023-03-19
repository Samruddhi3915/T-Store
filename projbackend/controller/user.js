const User=require("../models/user");//importing user
const Order=require("../models/order");//importing order
exports.getUserById=(req,res,next,id)=>{//middleware
    User.findById(id).exec((err,user)=>{
        if(err||!user)
        {
            return res.status(400).json({
                error:"No user found in DB"
            });
        }
        console.log(user);
        req.profile=user;
        

        next();
    });
};
// exports.getUserNoId=(req,res,next)=>{//middleware
//     User.find().exec((err,user)=>{
//         if(err||!user)
//         {
//             return res.status(400).json({
//                 error:"No user found in DB"
//             });
//         }
//         res.json(user);
        

//     });
// };
exports.getUser=(req,res)=>{
    req.profile.salt=undefined;
    req.profile.encry_password=undefined;
    req.profile.createdAt=undefined;
    req.profile.updatedAt=undefined;
    return res.json(req.profile);
}
exports.updateUser=(req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},//values to be updated
        {new:true,useFindAndModify:false},//compulsory param for findbyidandupdate
        (err,user)=>{
            if(err)
            {
                return res.status(400).json({
                    error:"You are not authorized to update this user",
                })
            }
            user.salt=undefined;
            user.encry_password=undefined;
            res.json(user);
        }
    )
}
//middleware for purchaselist
exports.pushOrderInPurchaseList=(req,res,next)=>{
    let purchases=[]
    req.body.order.products.forEach(product=>{
        purchases.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        });
    });
    //store this in db
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new:true},//flag
        (err,purchase)=>{
            if(err){
                return res.status(400).json({
                    error:"Unable to save the purchase list"
                });
            }
            next();
        }
        );
    };







//we are pulling information from order model here using cross collection by using populate method
exports.userPurchaseList=(req,res)=>{
    Order.find({user: req.profile._id})
    .populate("user","_id name")
    .exec((err,order)=>{
        if(err)
        {
            return res.status(400).json({
                error:"No orders were found in this acccount"
            })
        }
        return res.json(order);
    })
}
//shift +option +down arrow key==duplication