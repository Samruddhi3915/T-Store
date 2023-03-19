const Product= require('../models/product');
const formidable=require('formidable');
const _=require('lodash');
const fs=require('fs');
exports.getProductById=(req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err)
        {
            return res.status(400).json({
                error:"Product not found "
            })
        }
        req.product=product;
        next();
    })

   
}
exports.createProduct=(req,res)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{
        if(err)
        {
            return res.status(400).json({
               error:"Problem with Image"
            })
        }
        //destructure the field
        const {name,description,price,category,stock}=fields;

        //checking for validations on fields
        if(!name || !description || !price || !category || !stock )
        {
                return res.status(400).json({
                    error:"Please include all fields" 
                });
        }
        
        let product = new Product(fields)
        //console.log(product)
        //console.log(product)
        //handling file
        if(files.photo)
        {
            if(files.photo.size>3000000)//if > 3 MB
            {
                return res.status(400).json({
                    error:"File size too Big!"
                })
            }
            //data is from model
            product.photo.data=fs.readFileSync(files.photo.filepath)
            product.photo.contentType=files.photo.type;
        }
        //saving photo to db
        product.save((err,product)=>{
            if(err)
            {
                return res.status(400).json({
                    error:"Saving a Tshirt in DB is failed"
                })
            }
            res.json(product);
        })
    })


}
exports.getProduct=(req,res)=>{
    req.product.photo=undefined;
    return res.json(req.product);
}
//middleware will load photo in the backend while the frontend is fired
exports.photo=(req,res,next)=>{
if(req.product.photo.data)
{
    res.set("Content-Type",req.product.photo.contentType)
    return res.send(req.product.photo.data)
}
next();
}


//delete product
exports.deleteProduct=(req,res)=>{
    let product=req.product;
    product.remove((err,deletedProduct)=>{
        if(err)
        {
            return res.status(400).json
            ({
                error:"Failed to delete the product"
            })
        }
        res.json
        ({
            message:"Deleted product successfully",
            deletedProduct
        })
    });
}


//update product
exports.updateProduct=(req,res)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{
        if(err)
        {
            return res.status(400).json({
               error:"Problem with Image"
            })
        }
        
        //code for updation
        let product = req.product;
        product=_.extend(product,fields)//helps to update the values
        //console.log(product)
        //console.log(product)
        
        
        
        //handling file
        if(files.photo)
        {
            if(files.photo.size>3000000)//if > 3 MB
            {
                return res.status(400).json({
                    message:"File size too Big!"
                })
            }
            //data is from model
            product.photo.data=fs.readFileSync(files.photo.filepath)
            product.photo.contentType=files.photo.type;
        }
        //saving photo to db
        product.save((err,product)=>{
            if(err)
            {
                return res.json({
                    message:"Updation of product failed"
                })
            }
            res.json(product);
        })
    })
}

//listing product

exports.getAllProducts=(req,res)=>{
   // let limit=8 
   //defualt 8 if user doesnt pass limit of productrs
   let limit=req.query.limit ? parseInt(req.query.limit)  : 8//since its string by default 
   let sortBy=req.query.sortBy ? req.query.sortBy : "_id"//will sort default by ID
   //re.query -- from frontend values
   
   
   Product.find()
    .select("-photo")//dont select photo
    .populate("category")//joins records from two documents
    .sort([[sortBy,"asc"]])//sort result based on our favourites like creationdate,
    .limit(limit)//limiting no of products to show
    .exec((err,products)=>{
        if(err)
        {
            return res.status(400).json({
                error:"No product found in DB"
            })
        }
        res.json(products)
    })
}


//listing all categories
exports.getAllUniqueCategories=(req,res)=>{
    Product.distinct("categories",{},(err,category)=>{
        if(err)
        {
            return res.status(400).json({
                error:"No catgeory found"
            })
        }
        res.json(category)
    })//get all unique categories
}




//updating stock and sold
exports.updateStock=(req,res,next)=>{

    let myOperations=req.body.order.products.map(prod=>{
        //loooping through cart of products

        return  {
            updateOne:{
                filter:{_id:prod._id},//filters on id of prouct got
                update:{$inc:{stock:-prod.count,sold:+prod.count}}//to update
                //stock to dec and sold inc
            }
        }
    })
    Product.bulkWrite(myOperations,{},(err,products)=>{
        if(err)
        {
            return res.status(400).json({
                error:"Bulk Operation failed"
            })
        }
        next();
    })//used to do multiple operations in one method as array
} 


