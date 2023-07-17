const userModel = require("./users-model");

const payloadCheck = (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !first_name.trim() || first_name.length <= 3) {
    next({ status: 400, message: "Name alanı 3 karakterden büyük olmalı!..." });
  } else if (!last_name || !last_name.trim() || last_name.length <= 3) {
    next({
      status: 400,
      message: "Surname alanı 3 karakterden büyük olmalı!...",
    });
  } else if (!password || !password.trim() || password.length <= 3) {
    next({
      status: 400,
      message: "Password alanı 3 karakterden büyük olmalı!...",
    });
  } else if (!email || !isValidEmail(email)) {
    next({ status: 400, message: "Geçerli bir email giriniz!..." });
  } else {
    next();
  }
};

const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const isIdExist = async (req, res, next) => {
  const { user_id } = req.params;
  const user = await userModel.getById(user_id);
  if (user) {
    req.user = user;
    next();
  } else {
    next({ status: 400, message: `${user_id} id'li kullanıcı bulunamadı!...` });
  }
};

const checkUserName = async (req, res, next) => {
  try {
    const isExist = await userModel.getByName(req.body.user_name);
    if (isExist) {
      res.status(400).json({ message: "This username is taken" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  payloadCheck,
  isIdExist,
  isValidEmail,
  checkUserName,
};
