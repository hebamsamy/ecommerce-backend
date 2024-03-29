// importing packages and modules
const express = require("express");
const cors = require("cors");
// importing the connection and routes
const connect = require("./connectonDb");
const productRoute = require("./src/routes/productRoute");
const categoryRoute = require("./src/routes/categoryRoute");
const orderRoute = require("./src/routes/orderRoute");
const userRoute = require("./src/routes/userRoute");

// Setting the port
const port = process.env.port || 5000;

// creating The server
const app = express();
const http = require("http").createServer(app)

// connecting to database
connect();

//to define the static files folder
app.use(express.static("src/images")); 

// app.use(express.urlencoded());
app.use(express.json());
app.use(cors("*"));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.set("Access-Control-Expose-Headers", "*");
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

// Routes middleware
app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/category", categoryRoute);
app.use("/order", orderRoute);


app.listen(port,()=>{
    console.log("localhost : "+port)
});
