const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: "Email address is required",
        validate: {
            validator: function (val) {
                let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return pattern.test(val);
            },
            message: "Please fill a valid email address"
        }
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    joinedDate: {
        type: Date,
        default: Date.now,
    },
    wishlist: {
        type: Array,
        default: []
    },
    cartlist: {
        type: [{
            quantity: {
                type: Number,
                default: 1
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Prodyct",
                required: true,
            },
        }],
        default: []
    },
    // nationalId: {
    //     type: String,
    // },
    // age: {
    //     type: Number,
    //     min: 15,
    //     max: 70
    // },
    role: {
        type: String,
        default: 'user',
        enum: {
            values: ['admin', 'vendor', 'user'],
            message: "You entered not valid value"
        }
    },
}, {
    versionKey: false,
    strict: false,
})

module.exports = mongoose.model("User", userSchema);