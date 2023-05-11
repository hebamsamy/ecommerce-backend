const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    /////////////////////////Commen
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imgURL: {
        type: String,
        default: "http://localhost:5000/default.png"
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    categoryID: {
        type: Number,
    },
    categoryName: {
        type: String,
    },
    colors:{
        type:Array
    },
    /////
    createdDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "available",
        enum: {
            values: ['available','out of order'],
        }
    },
}, {
    versionKey:false,
    strict:false,
})

module.exports = mongoose.model("Product", productSchema);