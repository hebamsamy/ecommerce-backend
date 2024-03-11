const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
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
}, {
    versionKey:false,
    strict:false,
})

module.exports = mongoose.model("Category", categorySchema);