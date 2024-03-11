const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const orderModel = require("../models/order");
const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
let secret = fs.readFileSync("secret.key");
const { verifyToken } = require("../shared/auth");

// make order
route.post("/", verifyToken, async function (req, res) {
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      let id = data.user._id;
      let user = await userController.getUserByID(id)
      // get cart list 
      let cartlist = user.cartlist;
      let order = new orderModel({
        productlist: [],
        paymentMethod: req.body.paymentMethod,
        totalPrice: 0,
        totalQuantity: 0,
        createdBy: id
      });
      cartlist.forEach(async (item, index) => {
        let prd = await productController.getproductByID(item.product)
        if (prd.quantity >= item.quantity) {
          order.productlist.push({
            supPrice: prd.price * item.quantity,
            product: item.product,
            quantity: item.quantity,
          })
          order.totalPrice += prd.price * item.quantity;
          order.totalQuantity += item.quantity;
          // update product quantity
          prd.quantity -= item.quantity
          prd.save()
        }
        else {
          // not enough quantity product
          user.wishlist.push(prd)
          await user.save();
        }
        if (index == (cartlist.length - 1)) {
          try {
            // remove cart list
            user.cartlist = [];
            await user.save();
            order = await order.save();
            res.json({
              message: "successfully done making order",
              status: 200,
              data: order,
              success: true,
            });
          } catch (e) {
            res.json({
              message: "Error:invalid ," + e,
              status: 401,
              data: null,
              success: false,
            });
          }
        }
      })
    }
  });
});
//cancel order
route.delete("/remove/:id", verifyToken, async function (req, res) {
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      let userid = data.user._id;
      let order = await orderModel.findById(req.params.id);
      if (order != undefined && order.createdBy._id == userid) {
        order.productlist.forEach(async (item, index) => {
          let prd = await productController.getproductByID(item.product)
          // update product quantity
          prd.quantity += item.quantity
          prd.save()
          if (index == (order.productlist.length - 1)) {
            try {
              order.status = 'canceled'
              order.save();
              res.json({
                message: "successfully done canceling order",
                status: 200,
                data: "done",
                success: true,
              });
            } catch (e) {
              res.json({
                message: "Error:invalid ," + e,
                status: 401,
                data: null,
                success: false,
              });
            }
          }
        })
      }
      else {
        res.json({
          message: "Sorry you can't",
          status: 200,
          data: "",
          success: true,
        });
      }
    }
  });
});
//vendor accept item in order
route.put("/vendor-change", verifyToken, async function (req, res) {
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      let userid = data.user._id;
      let order = await orderModel.findById(req.body.orderid);
      if (order != undefined) {
        try {
          // doc.populate(\"arr.0.path\")
          order.productlist.forEach(async (element, index) => {
            if (element.product == req.body.productid) {
              order = await order.populate(`productlist.${index}.product`)
              if (order.productlist[index].product.createdBy == userid) {
                order.productlist[index].status = "accepted";
                order.status = "preparing";
                await order.save();
                res.json({
                  message: "successfully done canceling order",
                  status: 200,
                  data: order,
                  success: true,
                });
              }
            }
          });
        } catch (e) {
          res.json({
            message: "Error:invalid ," + e,
            status: 401,
            data: null,
            success: false,
          });
        }
      }
    }
  });
});
//get vendor items in orders
route.get("/vendor", verifyToken, async function (req, res) {
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      // doc.populate(\"productlist.0.product\")
      let vendorOrdersProducts = []
      let vendorid = data.user._id;
      let products = await productController.getproductByVendorID(vendorid);
      products =  products.map(prd=>prd._id)
      let orders = await orderModel.find().populate("createdBy");

      if (products != undefined || products.length > 0) {
        try {
          orders.forEach((element, index) => {
            element.productlist.forEach((product, ind) => {
              let temp = products.find(p => product.product.equals(p))
              if (temp != undefined) {
                vendorOrdersProducts.push({
                  orderId:element._id,
                  status:element.status,
                  product:product
                })
              }
            });
            if (index == (orders.length - 1)) {
              res.json({
                message: "successfully",
                status: 200,
                data: vendorOrdersProducts,
                success: true,
              });
            }
          })
        } catch (e) {
          res.json({
            message: "Error:invalid, " + e,
            status: 401,
            data: null,
            success: false,
          });
        }
      }
      else {
        res.json({
          message: "you don't have products",
          status: 200,
          data: "",
          success: true,
        });
      }
    }
  });
});
//get user items in orders
route.get("/user", verifyToken, async function (req, res) {
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      let userid = data.user._id;
      let orders = await orderModel.find({createdBy :userid });

      if (orders != undefined || orders.length > 0) {
        res.json({
          message: "successfully",
          status: 200,
          data: orders,
          success: true,
        });
      }
      else {
        res.json({
          message: "you don't have Orders yet !!!!",
          status: 200,
          data: "",
          success: true,
        });
      }
    }
  });
});

module.exports = route;
