const mongoose = require('mongoose');

const post =  mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        image:{
            type: String,
            required: true
        },
        price:{
            type: String,
            required: true
        },
        category:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required: true
        }
    }
);

module.exports = mongoose.model('Product',post)