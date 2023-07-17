const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/index");
const userModel = require("../Users/users-model");

const restricted = (req, res, next) => {
  try {
    const token = req.header.authorization;
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decodedJWT) => {
        // decodedJWT hashlenmiş
        if (!err) {
          req.decodedJWT = decodedJWT;
          next();
        } else {
          next(err);
        }
      });
    } else {
      next({ status: 400, message: "Token required!.." });
    }
  } catch (err) {
    next(err);
  }
};

const generateToken = (user) => {
  const payload = {
    user_id: user.user_id,
    user_name: user.user_name,
    email: user.email,
  };
  const options = {
    expiresIN: "2h",
  };
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
};

const isUserNameValid = async (req, res, next) => {
  try {
    const user_name = req.body;
    const existedName = await userModel.getByFilter({ user_name });
    if (existedName) {
      res.status(422), json({ message: "This username has already taken..." });
    } else {
      next({ status: 201, message: "Username was created!.." });
    }
  } catch (err) {
    next(err);
  }
};

const checkUserName = async (req, res, next) => {
  const user_name = req.body;
  const user = await userModel.getByFilter({ user_name });
  if (!user) {
    res.status(401).json({ message: "Invalid user criter." });
  } else {
    req.user = user;
    next();
  }
};

const isEmailAvailable = async (req, res, next) => {
  const email = req.body;
  const user = await userModel.getByFilter({ email });
  if (!user) {
    next();
  } else {
    next({ status: 400, message: "Email is not available!.." });
  }
};

module.exports = {
  restricted,
  generateToken,
  isUserNameValid,
  checkUserName,
  isEmailAvailable,
};
