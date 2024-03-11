// Connecting to the database
const mongoose = require("mongoose");
// const url = "mongodb://127.0.0.1:27017/Schema"
const url = "mongodb://127.0.0.1:27017/ecommerce"

const connect = async function() {
    await mongoose.connect(url);
    console.log("You are connected to your database");
}


module.exports = connect;