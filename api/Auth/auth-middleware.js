const jwt = require("jsonwebtoken");
const { HASH_ROUND, JWT_SECRET } = require("../../config/index");
const userModel = require("../Users/users-model");
const bcryptjs = require("bcryptjs");
const authModel = require("../Auth/auth-model");

const restricted = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decodedJWT) => {
        //decodedJWT hashlenmiş
        if (!err) {
          req.decodedUser = decodedJWT;
          next();
        } else {
          next(err);
        }
      });
    } else {
      next({ status: 400, message: "Token is required!..." });
    }
  } catch (err) {
    next(err);
  }
};

const hashPassword = async (req, res, next) => {
  req.body.password = bcryptjs.hashSync(req.body.password, Number(HASH_ROUND));
  next();
};

const generateToken = async (req, res, next) => {
  try {
    const user = req;
    const payload = {
      user_id: user.user_id,
      user_name: user.user_name,
      email: user.email,
    };
    const options = {
      expiresIn: "2h",
    };
    const token = jwt.sign(payload, JWT_SECRET, options);
    req.user.token = token;
    next();
  } catch (err) {
    next(err);
  }
};

const isEmailExist = async (req, res, next) => {
  const { email } = req.body;
  const user = await authModel.getByFilter({ "u.email": email });
  if (user.length === 0) {
    next({ status: 401, message: "Invalid credentials!.." });
  } else {
    req.user = user[0];
    next();
  }
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

const passwordCheck = (req, res, next) => {
  try {
    if (!req.user) {
      next({ status: 401, message: "Invalid credentials!.." });
      return;
    }
    const isPasswordValid = bcryptjs.compareSync(
      req.body.password,
      req.user.password
    );
    if (isPasswordValid) {
      next();
    } else {
      next({ status: 401, message: "Invalid credentials!.." });
    }
  } catch (error) {
    next(error);
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

const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      next();
    } else {
      next({ status: 403, message: "Token is already expired!..." });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  restricted,
  generateToken,
  isUserNameValid,
  checkUserName,
  isEmailAvailable,
  hashPassword,
  logout,
  passwordCheck,
  isEmailExist,
};
