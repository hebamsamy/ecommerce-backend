const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    totalPrice: {
        type: Number,
        required: true
    },
    totalQuantity: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "pending",
        enum: {
            values: ['pending', 'completed', 'canceled','preparing' ,'ondelivery'],
        }
    },
    paymentMethod: {
        type: String,
        default: "cash",
        enum: {
            values: ['cash', 'creditcard'],
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productlist: {
        type: [
            {
                quantity: {
                    type: Number,
                    required: true,
                },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                supPrice: {
                    type: Number,
                    required: true
                },
                status: {
                    type: String,
                    default: "pending",
                    enum: {
                        values: ['pending', 'accepted', 'rejected',],
                    }
                },
            }
        ],
        required: true,
    },
}, {
    versionKey: false,
    strict: false,
})

module.exports = mongoose.model("Order", orderSchema);