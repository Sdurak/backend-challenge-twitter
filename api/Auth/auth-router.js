const router = require("express").Router();
const mw = require("./auth-middleware");
const bcrypt = require("bcryptjs");
const userModel = require("../Users/users-model");
const userMw = require("../Users/users-middleware");
const tokenHelper = require("../../Helper/token-helper");

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
  mw.isEmailExist,
  mw.passwordCheck,
  mw.generateToken,
  (req, res, next) => {
    try {
      const user = req.user;
      const token = user.token;
      res.json({ message: `Welcome back ${user.user_name}...`, token });
    } catch (err) {
      next(err);
    }
  }
);
router.get("/logout", mw.restricted, mw.logout, (req, res, next) => {
  try {
    tokenHelper.logout(req.headers.authorization);
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
