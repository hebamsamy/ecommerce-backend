const express = require("express");
const route = express.Router();
const multer = require('multer');
const productController = require("../controllers/productController")

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads")
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname);
    }
})
// The filteration
const multerFilter = function (req, file, cb) {
    if (file.mimetype.split("/")[0] == "image") {
        cb(null, true)
    }
    else {
        cb(new Error("Not image"), false)
    }
}
// The middleware
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

// // Add new product
// route.post("/", function(req, res) {
// })
//************************Get All Products ************************
route.get("/", async function (req, res) {
    const products = await productController.getAll();
    res.json({
        message: "all product",
        status: 200,
        data: products,
        success: true,
      });
  });
//************************Get All Products by category************************
route.get("/category/:id", async function (req, res) {
    const products = await productController.getproductByCategoryID( req.params.id);
    res.json({
        message: "all product by category id "+id,
        status: 200,
        data: products,
        success: true,
      });
  });
// Get by the Id .........id is required
route.get("/:id", async function(req, res) {
    let exist = await productController.check_if_product_exist( req.params.id)
    if(exist){
        let data = await productController.getproductByID( req.params.id)
        res.json({
            message: "get product",
            status: 200,
            data: data,
            success: true,
          });
    }
    else{
        res.json({
            message: "not exists",
            status: 400,
            data:  req.params.id,
            success: false,
          });
    }
})


// When writing a new message ..........{conversationId: "Id", sender: "Sendertype", text: ""} is required
// route.post("/", async function(req, res) {
//     try {
//         const message = {
//             senderType: req.body.senderType,
//             date:  Date.now,
//             text: req.body.text
//         }
//         Conversation.findById(req.body.conversationId).then((data)=> {
//             console.log(data);
//             data.messages.push(message);
//             Company.findById(data.companyId).then((company)=>{
//                 company.newMessage = true;
//                 company.save();
//             });
//             Client.findById(data.clientId).then((client)=>{
//                 client.newMessage = true;
//                 client.save();
//             });

//             data.save();

//             res.status(200).json({success: true, message: "You sent a new message", data: data.messages});
//         }).catch((err)=> {
//             console.log(err);
//             res.status(500).json({success: false, message: err.message})
//         })
//     }
//     catch(err)  {
//         console.log(err);
//         res.status(500).json({success: false, message: err.message})
//     }
// })


module.exports = route;
