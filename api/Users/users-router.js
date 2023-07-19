const router = require("express").Router();
const userModel = require("./users-model");
const mw = require("./users-middleware");

router.get("/", async (req, res, next) => {
  try {
    const users = await userModel.getAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:user_id", mw.isIdExist, async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await userModel.getById(user_id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.delete("/:user_id", mw.isIdExist, async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const account = await userModel.remove(user_id);
    if (account) {
      res.json({ message: `User id ${user_id}, deleted...` });
    } else {
      res
        .status(400)
        .json({ message: `Error in deleting User id ${user_id}!..` });
    }
  } catch (err) {
    next(err);
  }
});

router.put("/:user_id", mw.isIdExist, async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const count = await userModel.update(user_id, req.body);
    if (count) {
      res.json({ message: `User id ${user_id}, updated...` });
    } else {
      res
        .status(400)
        .json({ message: `Error in updating User id ${user_id}!..` });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", mw.payloadCheck, mw.checkUserName, async (req, res, next) => {
  try {
    let insertModel = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      user_name: req.body.user_name,
    };
    const insertedUser = await userModel.create(insertModel);
    res.status(201).json(insertedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
