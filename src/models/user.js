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
        validate:{
            validator: function(val) {
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
    wishlist:{
        type : Array,
        default:[]
    },
    cartlist:{
        type : Array,
        default:[]
    },
    // nationalId: {
    //     type: String,
    // },
    // age: {
    //     type: Number,
    //     min: 15,
    //     max: 70
    // },
    // gender: {
    //     type: String,
    //     enum: {
    //         values: ['male', 'female'],
    //         message: "You entered not valid value"
    //     }
    // },
}, {
    versionKey:false,
    strict:false,
})

module.exports = mongoose.model("User", userSchema);