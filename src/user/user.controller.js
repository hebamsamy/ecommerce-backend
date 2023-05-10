import { customAlphabet } from "nanoid";
import { encryptPassword, comparePasswords } from "../../helpers/bcrypt.js";
import { addToDate, isDateInThePast } from "../../helpers/date.js";
import { createToken } from "../../helpers/jwt.js";
import { userToken } from "../../helpers/tokens.js";
import sendVerificationMail from "../../services/Mail/mailService.js";
import { CustomError, errors } from "../../utils/errors.js";
import respondWith from "../../utils/response.js";
import * as userServices from "./user.services.js";
import { buildUserResponseDTO } from "./user.mapper.js";

const register = async (req, res, next) => {
  try {
    const userInfo = req.body;

    const isRegistered = await userServices.getUser(userInfo.email);
    if (isRegistered) {
      throw new CustomError(errors.ALREADY_EXIST, 409);
    }

    // hash the user's password
    const hashedPassword = await encryptPassword(userInfo.password);
    userInfo.password = hashedPassword;

    // adding user's verification code
    const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nanoid = customAlphabet(alphabet, 6);
    const verificationCode = nanoid();
    userInfo.verificationCode = verificationCode;

    // Setting verification code lifetime in hours
    const verificationCodeLifeTime = 24;
    userInfo.codeExpiryDate = addToDate(new Date(), verificationCodeLifeTime, "hours");

    // register the user
    const user = await userServices.addUser(userInfo);

    // Send verification mail to the user
    await sendVerificationMail(user, verificationCodeLifeTime);

    return respondWith(
      201,
      {},
      "You've been registered successfully, please check your mail to verify your account!",
      true,
      res,
    );
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const userInfo = req.body;
    const user = await userServices.getUser(userInfo.email);

    // Check if user exist
    if (!user) {
      throw new CustomError(errors.NOT_FOUND, 401);
    }

    const isCorrectPassword = await comparePasswords(userInfo.password, user.password);
    // check if the entered password is correct
    if (!isCorrectPassword) {
      throw new CustomError(errors.NOT_AUTHENTICATED, 401);
    }

    // check if the user has a verfied account
    if (!user.isVerified) {
      throw new CustomError(errors.NOT_VERIFIED, 403);
    }

    // Generate Token
    const token = createToken(userToken(user._id, user.email));

    return respondWith(200, { token }, "Logged in successfully. Welcome!", true, res);
  } catch (err) {
    next(err);
  }
};

const verify = async (req, res, next) => {
  try {
    const { verificationCode } = req.body;

    const user = await userServices.getUserByCode(verificationCode);

    // Check if user exists
    if (!user) {
      throw new CustomError(errors.NOT_FOUND, 401);
    }

    // Check if user is verified
    if (user.isVerified) {
      throw new CustomError(errors.ALREADY_VERIFIED, 200);
    }

    const isCodeExpired = isDateInThePast(user.codeExpiryDate);

    // check code expiry date
    if (isCodeExpired) throw new CustomError(errors.EXPIRED_CODE, 410);

    await userServices.verify(user._id);

    return respondWith(200, {}, "Your account has been verified successfully!", true, res);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    let user = await userServices.getUserById(id);
    return respondWith(200, buildUserResponseDTO(user), `Here's your data ${user.fname}!.`, true, res);
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    let users = await userServices.getAllUsers();
    console.log(users[0]);

    users = users.map((user) => {
      return buildUserResponseDTO(user);
    });
    console.log(users[0]);

    return respondWith(200, users, "These are all the our users!.", true, res);
  } catch (err) {
    next(err);
  }
};

const editUser = async (req, res, next) => {
  try {
    const userInfo = req.body;
    const user = await userServices.getUserById(userInfo.userId);

    if (!user) {
      throw new CustomError(errors.NOT_FOUND, 403);
    }

    await userServices.editUser(userInfo);
    return respondWith(201, {}, "Your personal information have been changed successfully", true, res);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await userServices.getUserById(userId);

    if (!user) {
      throw new CustomError(errors.NOT_FOUND, 403);
    }
    await userServices.deleteUser(userId);
    return respondWith(200, {}, "The user has been deleted successfully", true, res);
  } catch (err) {
    next(err);
  }
};

export { register, login, verify, getUser, getAllUsers, editUser, deleteUser };
