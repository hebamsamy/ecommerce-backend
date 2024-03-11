const express = require("express");
const route = express.Router();
const categoryController = require("../controllers/categoryController");
const userController = require("../controllers/userController");
const categoryModel = require("../models/category");
const fs = require("fs");
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
//************************Get All categories ************************
route.get("/", async function (req, res) {
  const categorys = await categoryController.getAll();
  res.json({
    message: "all category",
    status: 200,
    data: categorys,
    success: true,
  });
});

// Get by the Id .........id is required
route.get("/:id", async function (req, res) {
  let data = await categoryController.getcategoryByID(req.params.id);
  if (data) {
    res.json({
      message: "get category details",
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
route.post("/add", verifyToken, upload.single("imgURL"), async function (req, res) {
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      let adminid = data.user._id;
      let admin = await userController.getUserByID(adminid)
      if (admin.role != "admin") {
        res.json({
          message: "Error:invalid credentials , you must join as admin",
          status: 401,
          data: "",
          success: false,
        });
      }
      //for multer
      let img;
      if (!req.file) {
        this.img = "http://localhost:5000/default.png"
      }
      else {
        img = await categoryController.get_Image_for_category(req.file);
      }
      //todo: add in database
      let category = new categoryModel({
        name: req.body.name,
        description: req.body.description,
        imgURL: img,
      });
      try {
        category = await category.save();
        res.json({
          message: "successfully added",
          status: 200,
          data: category,
          success: true,
        });
      } catch (e) {
        res.json({
          message: "Error:invalid category ," + e,
          status: 401,
          data: null,
          success: false,
        });
      }
    }
  });
});

///////////////////////////////////////////Edit
route.put("/edit/:id", verifyToken, upload.single("imgURL"), async function (req, res) {
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      let adminid = data.user._id;
      let admin= await userController.getUserByID(adminid)
      let exist = await categoryController.getcategoryByID(req.params.id);
      if (!exist ||admin.role != "admin") {
        res.json({
          message: "this category not exists or you don't have premassion to see it",
          status: 400,
          data: req.params.id,
          success: false,
        });
      } else {
        let img;
        if (!req.file) {
          //no file keep old
          img = exist.imgURL
        }
        else {
          img = await categoryController.get_Image_for_category(req.file);
        }
        try {
          category = await categoryModel.findById(req.params.id).then((category) => {
            category.name = req.body.name,
              category.description = req.body.description,
              category.imgURL = img,
              category.save()
          });
          res.json({
            message: "successfully edited",
            status: 200,
            data: category,
            success: true,
          });
        } catch (e) {
          res.json({
            message: "Error:invalid category ," + e,
            status: 401,
            data: null,
            success: false,
          });
        }
      }
    }
  });
});

////////////// ///////////////////////////Delete category ////////////
route.delete("/delete/:id", verifyToken, (req, res) => {
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      let adminid = data.user._id;
      let admin= await userController.getUserByID(adminid)
      let exist = await categoryController.getcategoryByID(req.params.id);
      if (!exist ||admin.role != "admin") {
        res.json({
          message: "this category not exists or you don't have premassion to see it",
          status: 400,
          data: req.params.id,
          success: false,
        });
      } else {

        categoryModel.findByIdAndDelete(req.params.id)
          .then(() => {
            res.json({
              message: "Deleted category successfully!",
              status: 200,
              data: category,
              success: true,
            });
          })
          .catch((err) => {
            res.json({
              message: "Error:invalid category ," + err,
              status: 401,
              data: null,
              success: false,
            });
          });
      }
    }
  })
});

module.exports = route;
