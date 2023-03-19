const mongoose=require('mongoose')

const {ObjectId}=mongoose.Schema

//Dependent on Product
const ProductCartSchema=mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product"
    },
    name:{
        type:String
    },
    count:{
        type:Number
    },
    price:{
        type:Number
    }

})

const orderSchema=mongoose.Schema({

    products:[ProductCartSchema],
    transaction_id:{},
    amount:{
        type:Number,
    },
    address:{
        type:String,
        maxlength:500,
    },
    status:{
        type:String,
        default:"Received", //default status will be received
        enum:["Cancelled","Delivered","Shipped","Processing","Received"]//restricted to given values only..aeroplane eg
    },
    updated:{
        type:Date
    },
    user:{
        type:ObjectId,
        ref:"User"
    }
},{timestamps:true})

const Order=mongoose.model("Order",orderSchema)
const ProductCart=mongoose.model("ProductCart",ProductCartSchema)

module.exports={
    ProductCart,Order
}