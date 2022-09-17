const product = require('../models/product');
const user = require('../models/user');
const {validationResult}= require('express-validator')
const path = require('path');
const fs = require('fs');
const category = require('../models/category');

exports.createproduct = (req,res,next)=>
{
    console.log(req.body);
    const error = validationResult(req);
     if(!error.isEmpty())
     {
       return  res.status(403).json(error.array());
     }
     if(!req.file)
     {
        res.status(403).json({'message':'image required'});
     }
//console.log(req.userData);
    const Product = new product({name:req.body.name,image:req.file.path,category:req.body.category,price:req.body.price});
    Product.save().then(w=>
                {
                    if(w)
                    {
                    res.status(200).json({message:'product created'});
                    }
                }).catch(err=>
            {
                res.status(500).json({message:err.message});
            })
}


exports.list = async(req,res,next)=>
{
    try{
        const take = req.query.perPage;
        const skip = (req.query.perPage*req.query.page)-req.body.perPage;
        console.log(req.query)
        let products;
        let total;
        if(req.query.category_id)
        {
            console.log(1)
             products = await product.find({"category":req.query.category_id}).skip(skip).limit(take);
            console.log(product);
             total = await product.find({"category":req.query.category_id}).countDocuments();
            console.log(total)
        }
        else{
            //console.log(2)
         products = await product.find().skip(skip).limit(take);
         total = await product.find().countDocuments();

        }
        if(products)
        {
            res.status(200).json({'products':products,total:total,message:'products found'});
        }
        else
        {
            res.status(404).json({'products':{},message:'products not found'});
        }
    }
    catch(err)
    {
            res.status(500).json({message:err.message});
    }
   


}

exports.update = async(req,res,next)=>
{
    try
    {
    const Product = await product.findById(req.params.id);
   
    if(Product)
    {
        Product.name = req.body.name;
        Product.price = req.body.price;
        Product.category= req.body.category;
    //product.creater = req.userData.userId;
    if(req.file)
    {
        image = req.file.path.replace("\\" ,"/");
     if(image == Product.image)
     {
        image = Product.image;
     }
     else
     {
        filePath = path.join(__dirname, '..', Product.image);
        fs.unlink(filePath, err => console.log(err));
     }
     Product.image = image;
    }
    
    await Product.save();
    res.status(200).json({message:'product updated successfully'});
    }
    else
    {
        res.status(404).json({message:'product not found'})
    }
   }
   catch(err)
   {
    res.status(500).json(err.message);
   }
}

exports.delete =async (req,res,next)=>
{
    try
    {
    const Product = await product.findById(req.params.id);
    if(Product)
    {
        await product.findByIdAndRemove(req.params.id);
        filePath = path.join(__dirname, '..', Product.image);
        fs.unlink(filePath, err => console.log(err));
        
        res.status(200).json({message:'product Deleted'})

    }
    else
    {
        res.status(404).json({message:'product not found'})
    }
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }



}


exports.addCategory =async (req,res,next)=>
{
    try
    {
      const add = new category({"name":req.body.name});
       const save = await add.save();
       if(save)
       {
        return res.status(201).json({message:'Category added'})
       }
    //    else
    //    {
    //      res.status(200).json({message:"Category not added"});
    //    }
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }


    
}

exports.updateCategory =async (req,res,next)=>
{
    try
    {
      const Category = await category.findById(req.params.id);
       
       if(Category)
       {
        Category.name = req.body.name;
        await Category.save()

        return res.status(200).json({message:'Category updated'});
       }
       else
       {
        return res.status(404).json({message:'Category not found'});
       }
   
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }


    
}


exports.categoryList =async (req,res,next)=>
{
    try
    {
      const Category = await category.find();
       
       if(Category)
       {
        

        return res.status(200).json({message:'Category list',list:Category});
       }
       else
       {
        return res.status(404).json({message:'Category not found'});
       }
   
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }


    
}



exports.deleteCategory =async (req,res,next)=>
{
    try
    {
        console.log('hi');
    const Category = await category.findById(req.params.id);
    if(Category)
    {
        await category.findByIdAndRemove(req.params.id);
    
        
        res.status(200).json({message:'Category Deleted'})

    }
    else
    {
        res.status(404).json({message:'Category not found'})
    }
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }


    
}