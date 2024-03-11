const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    colors:{
        type:Array
    },
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    versionKey:false,
    strict:false,
})

module.exports = mongoose.model("Product", productSchema);