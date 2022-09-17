const express = require('express')
const route = express.Router();
const ProductController = require('../controllers/ProductController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const authAll = require('../middleware/authAll');
const {body,validationResult} = require('express-validator');
const fileupload = require('../middleware/fileupload')

route.post('/createproduct',authAdmin,fileupload,body('name').notEmpty().withMessage('Name is required'),body('price').notEmpty().withMessage('Price is required'),body('category').notEmpty().withMessage('category is required'),ProductController.createproduct);
route.get('/list',authAll,ProductController.list);
route.put('/update/:id',authAdmin,fileupload,ProductController.update);
route.delete('/delete/:id',authAdmin,ProductController.delete);

route.post('/addCategory',authAdmin,ProductController.addCategory);
route.put('/updateCategory/:id',authAdmin,ProductController.updateCategory);
route.get('/categoryList',authAll,ProductController.categoryList);
route.delete('/deleteCategory/:id',authAdmin,ProductController.deleteCategory);

module.exports = route;