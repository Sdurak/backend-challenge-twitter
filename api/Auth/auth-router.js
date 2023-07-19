// const router = require("express").Router();
// const mw = require("./auth-middleware");
// const bcryptjs = require("bcryptjs");
// const userModel = require("../Users/users-model");

// router.post(
//   "./register",
//   mw.isUserNameValid,
//   mw.isEmailAvailable,
//   async (req, res, next) => {
//     try {
//       let { user_name, email, password, first_name, last_name } = req.body;
//       const hashedPassword = bcryptjs.hashSync(password);
//       const newUser = await userModel.insert({
//         user_name: user_name,
//         email: email,
//         password: hashedPassword,
//         first_name: first_name,
//         last_name: last_name,
//       });
//       console.log(newUser);
//       res.status(201).json(newUser);
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// module.export = router;

const router = require("express").Router();
const mw = require("./auth-middleware");
const bcrypt = require("bcryptjs");
const userModel = require("../Users/users-model");
const userMw = require("../Users/users-middleware");
router.post(
  "/register",
  userMw.payloadCheck,
  mw.hashPassword,
  async (req, res, next) => {
    try {
      const payload = req.body;
      const user = await userModel.create(payload);
      if (user) {
        res.status(201).json({ message: `Merhaba ${user.user_name}...` });
      } else {
        next({ status: 400, message: "Kayıt sırasında hata oluştu!.." });
      }
    } catch (err) {
      next(err);
    }
  }
);
router.post(
  "/login",
  mw.isEmailAvailable,
  mw.passwordCheck,
  mw.generateToken,
  async (req, res, next) => {
    try {
      const user = req.user;
      const token = user.token;
      res.json({ message: `Welcome back ${user.user_name}...`, token });
    } catch (err) {
      next(err);
    }
  }
);
router.get("/logout", mw.restricted, mw.logout, async (req, res, next) => {
  try {
    const user_name = req.decodedUser.user_name;
    res.json({ message: `Get back soon ${user_name}...` });
  } catch (err) {
    next(err);
  }
});
router.get("/me", mw.restricted, async (req, res, next) => {
  try {
    const user_id = req.decodedUser.user_id;
    const user = await userModel.getById(user_id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
