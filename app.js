 //require('./db');
 const mongoose = require('mongoose');
 const express = require('express');
const app = express();
const user = require('./routes/user');
const product = require('./routes/product');
const body = require('body-parser');
const path = require('path')
const cors = require('cors');

app.use(body.json());
app.use(body.urlencoded({ extended: true }));
app.use('/images',express.static(path.join(__dirname, 'images')));
// app.use(cors({
//     origin: '*'
// }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });






app.use('/user',user);
app.use('/product',product);
mongoose.connect('mongodb+srv://asif2476:asif2476@cluster0.moatn.mongodb.net/assesment?retryWrites=true&w=majority').then(result =>{
    app.listen(3000);
    console.log('working')
}).catch(error=>
    {
        console.log(error);
    });
