const jwt = require("jsonwebtoken");
const { HASH_ROUND, JWT_SECRET } = require("../../config/index");
const userModel = require("../Users/users-model");
const bcryptjs = require("bcryptjs");
const redis = require("redis");
const client = redis.createClient();

client.on("error", (err) => {
  console.error("Redis Error:", err);
});

const restricted = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const tokenValue = await client.get(token);
      if (tokenValue) {
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
        next({ status: 403, message: "Token is expired!..." });
      }
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
      expiresIN: "2h",
    };
    const token = jwt.sign(payload, JWT_SECRET, options);
    req.user.token = token;
    await client.set(token, 1, { EX: 60 * 60 * 2 });
    next();
  } catch (err) {
    next(err);
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

const passwordCheck = async (req, res, next) => {
  if (bcryptjs.compareSync(req.body.password, req.user.password)) {
    next();
  } else {
    next({ status: 401, message: "Invalid credentials!.." });
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
      const tokenValue = await client.get(token);
      if (tokenValue) {
        await client.del(token);
        next();
      } else {
        next({ status: 403, message: "Token is already expired!..." });
      }
    } else {
      next({ status: 403, message: "Token is required to log out!..." });
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
};
