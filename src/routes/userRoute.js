const userController = require("../controllers/userController");
const userModel = require("../models/user");

const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcryptjs");
let secret = fs.readFileSync("secret.key");
const { verifyToken } = require("../shared/auth");

//************************ Register ************************

route.post("/register", async function (req, res) {
  if (
    req.body.name == "" ||
    req.body.email == "" ||
    req.body.password == "" ||
    req.body.phoneNumber == "" 
  ) {
    res.json({
      message: "Error : you should insert valid values",
      status: 400,
      data: req.body,
      success: false,
    });
  } else {
    //  if email exist console email aready exist
    let exist = await userController.check_if_email_exist(req.body.email);

    if (exist) {
      res.json({
        message: "email aready exist",
        status: 400,
        data: exist,
        success: false,
      });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;

      let new_user = await userController.register_new_user(req.body);
      res.json({
        message: "Successfull regestration go to sign in",
        status: 200,
        data: new_user,
        success: true,
      });
    }
  }
});

//************************ Login ************************

route.post("/login", async function (req, res) {
  const user = await userController.getUserByEmail(req.body.email);
  if (!user) {
    res.json({
      message: "Error:invalid credentials , on account found",
      status: 401,
      data: req.body,
      success: false,
    });
  } else {
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isValidPassword) {
      jwt.sign({ user }, secret, (err, token) => {
        res.json({
          message: "Login Successfully",
          status: 200,
          success: true,
          data: {user:user,token:token},
        });
      });
    } else {
      res.json({
        message: "Error:invalid credentials , password incorrect",
        status: 401,
        data: req.body,
        success: false,
      });
    }
  }
});
//************************ Update User ************************

route.post("/update", verifyToken, async function (req, res) {
  console.log(req.token);
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      let id = data.data_of_login_user._id;
      //todo: update in database
    }
  });
});

//************************ All Client ************************
route.get("/", async function (req, res) {
  const clients = await userController.getAllClients();
  res.json({
    message: "all users",
    status: 200,
    data: clients,
    success: true,
  });
});
// ******************** WISHLIST *************************

// add product to user wishlist
route.post("/wishlist/add", verifyToken, async function (req, res) {
  console.log(req.token);
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      let id = data.data_of_login_user._id;
      await userModel
        .findById(id)
        .then((user) => {
          console.log(user);
          //check if exists
          user.wishlist.forEach((item) => {
            console.log(item);
            if (item.id == req.body.id) {
              res.json({
                message: "product already in wish list",
                status: 400,
                data: user.wishlist,
                success: false,
              });
            }
          });
          user.wishlist.push(req.body);
          user.save();
          res.json({
            message: "all user data",
            status: 200,
            data: user,
            success: true,
          });
        })
        .catch((err) => {
          res.json({
            message: "user not found",
            status: 400,
            data: null,
            success: false,
          });
        });
    }
  });
});
//get all wish list items for user
route.get("/wishlist", verifyToken, async function (req, res) {
  console.log(req.token);
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      let id = data.data_of_login_user._id;
      userModel
        .findById(id)
        .then((user) => {
          console.log(user);
          res.json({
            message: "all user wish list",
            status: 200,
            data: user.wishlist,
            success: true,
          });
        })
        .catch((err) => {
          res.json({
            message: "user not found",
            status: 400,
            data: null,
            success: false,
          });
        });
    }
  });
});
//get all wish list items for user
route.get("/wishlist/remove/:id", verifyToken, async function (req, res) {
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      let id = data.data_of_login_user._id;
      await userModel
        .findById(id)
        .then((user) => {
          console.log(user);
          let result = user.wishlist.filter((item) => {
            return item.id != req.params.id;
          });
          user.wishlist = result;

          user.save();
          res.json({
            message: "all user data",
            status: 200,
            data: user,
            success: true,
          });
        })
        .catch((err) => {
          res.json({
            message: "user not found",
            status: 400,
            data: null,
            success: false,
          });
        });
    }
  });
});
//get all wish list items for user
route.get("/wishlist/empty", verifyToken, async function (req, res) {
  console.log(req.token);
  jwt.verify(req.token, secret, async (err, data) => {
    if (err) {
      res.json({
        message: "Error:invalid credentials , on token found",
        status: 401,
        data: req.token,
        success: false,
      });
    } else {
      let id = data.data_of_login_user._id;
      userModel
        .findById(id)
        .then((user) => {
          console.log(user);
          user.wishlist = []
          user.save()
          res.json({
            message: "all user wish list",
            status: 200,
            data: user.wishlist,
            success: true,
          });
        })
        .catch((err) => {
          res.json({
            message: "user not found",
            status: 400,
            data: null,
            success: false,
          });
        });
    }
  });
});
module.exports = route;
