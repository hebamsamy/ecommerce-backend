const express = require("express");
const route = express.Router();
const productController = require("../controllers/productController");
const productModel = require("../models/product");
const fs = require("fs");
const bcrypt = require("bcryptjs");
let secret = fs.readFileSync("secret.key");
const { verifyToken } = require("../shared/auth");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
// The filteration
const multerFilter = function (req, file, cb) {
  if (file.mimetype.split("/")[0] == "image") {
    cb(null, true);
  } else {
    cb(new Error("Not image"), false);
  }
};
// The middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

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
  const products = await productController.getproductByCategoryID(
    req.params.id
  );
  res.json({
    message: "all product by category id " + id,
    status: 200,
    data: products,
    success: true,
  });
});
// Get by the Id .........id is required
route.get("/:id", async function (req, res) {
  let exist = await productController.check_if_product_exist(req.params.id);
  if (exist) {
    let data = await productController.getproductByID(req.params.id);
    res.json({
      message: "get product",
      status: 200,
      data: data,
      success: true,
    });
  } else {
    res.json({
      message: "not exists",
      status: 400,
      data: req.params.id,
      success: false,
    });
  }
});

///////////////////////////////////////////Add
// route.post("/add", verifyToken, upload.single("img"),async function (req, res) {
route.post("/add", upload.single("imgURL"), async function (req, res) {
  // jwt.verify(req.token, secret, async (err, data) => {
  //     if (err) {
  //       res.json({
  //         message: "Error:invalid credentials , on token found",
  //         status: 401,
  //         data: req.token,
  //         success: false,
  //       });
  //     } else {
  // let id = data.user._id;
  //for multer
  let img ;
  if(!req.file){
    this.img = "http://localhost:5000/default.png"
  }
  else{
      img = await productController.get_Image_for_product(req.file);
  }
  //todo: add in database
  let product = new productModel({
    name: req.body.name,
    description: req.body.description,
    imgURL: img,
    colors: req.body.colors,
    price: req.body.price,
    quantity: req.body.quantity,
    categoryID: req.body.categoryID,
    categoryName: req.body.categoryName,
  });
  try {
    product = await product.save();
    res.json({
      message: "successfully added",
      status: 200,
      data: product,
      success: true,
    });
  } catch (e) {
    res.json({
      message: "Error:invalid product ," + e,
      status: 401,
      data: null,
      success: false,
    });
  }
  // }
  // });
});

///////////////////////////////////////////Edit
route.put("/edit/:id", upload.single("imgURL"), async function (req, res) {
  let exist = await productController.check_if_product_exist(req.params.id);
  if (!exist) {
    res.json({
      message: "not exists",
      status: 400,
      data: req.params.id,
      success: false,
    });
  } else {

    let img;
    if(!req.file){
        //no file keep old
        img = exist.imgURL
    }
    else{
        img = await productController.get_Image_for_product(req.file);
    }

    try {
      product = await productModel.findById(req.params.id).then((product)=>{
        product.name  = req.body.name,
        product.description  = req.body.description,
        product.imgURL  = img,
        product.colors  = req.body.colors,
        product.price  = req.body.price,
        product.quantity  = req.body.quantity,
        product.categoryID  = req.body.categoryID,
        product.categoryName  = req.body.categoryName,
        product.save()
      });
      res.json({
        message: "successfully added",
        status: 200,
        data: product,
        success: true,
      });
    } catch (e) {
      res.json({
        message: "Error:invalid product ," + e,
        status: 401,
        data: null,
        success: false,
      });
    }
  }
});

////////////// Delete Product ////////////
route.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

      productModel.findByIdAndDelete(id)
        .then(() => {
          res.json({
            message: "Deleted product successfully!",
            status: 200,
            data: product,
            success: true,
          });
        })
        .catch((err) => {
            res.json({
                message: "Error:invalid product ," + err,
                status: 401,
                data: null,
                success: false,
              });
        });
});

module.exports = route;
