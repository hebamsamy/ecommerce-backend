import express from "express";
const router = express.Router();
import { isAuth, validateSchema } from "../../middlewares/index.js";
import * as userController from "./user.controller.js";
import * as userValidation from "./user.validation.js";

router.get("/all", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.post("/signup", validateSchema(userValidation.signUp, "body"), userController.register);
router.post("/verify", validateSchema(userValidation.verifyUser, "body"), userController.verify);
router.post("/signin", validateSchema(userValidation.signIn, "body"), userController.login);
router.put("/edit", isAuth, validateSchema(userValidation.editUser, "body"), userController.editUser);
router.delete(
  "/delete",
  isAuth,
  validateSchema(userValidation.deleteUser, "body"),
  userController.deleteUser,
);

export default router;
