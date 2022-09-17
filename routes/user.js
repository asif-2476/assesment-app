const express = require('express')
const route = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const {body,validationResult} = require('express-validator');
const authAdmin = require('../middleware/authAdmin'); 

route.post('/create',
body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('please enter a valid mail'),
body('password').notEmpty().withMessage('Password is required'),body('name').notEmpty().withMessage('Name is required')

,UserController.create);
route.post('/login',body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('please enter a valid mail'),
body('password').notEmpty().withMessage('Password is required'),UserController.login);

route.get('/list',authAdmin,UserController.list);


module.exports = route;