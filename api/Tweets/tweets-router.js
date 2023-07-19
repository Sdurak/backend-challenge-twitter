const router = require("express").Router();
const tweetModel = require("./tweets-model");
const mw = require("./tweets-middleware");
const authMw = require("../Auth/auth-middleware");

router.get("/", async (req, res, next) => {
  try {
    const tweets = await tweetModel.getAll();
    res.json(tweets);
  } catch (err) {
    next(err);
  }
});

router.get("/:tweet_id", mw.isIdExist, async (req, res, next) => {
  try {
    const { tweet_id } = req.params;
    const tweet = await tweetModel.getById(tweet_id);
    res.json(tweet);
  } catch (err) {
    next(err);
  }
});

router.post("/", authMw.restricted, mw.maxCharacter, async (req, res, next) => {
  try {
    let content = req.body;
    const insertedTweet = await tweetModel.create(content);
    res.status(201).json(insertedTweet);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:tweet_id",
  authMw.restricted,
  mw.isIdExist,
  async (req, res, next) => {
    try {
      const { tweet_id } = req.params;
      const existedTweet = await tweetModel.remove(tweet_id);
      if (existedTweet) {
        res.json({ message: `Tweet id ${tweet_id}, deleted...` });
      } else {
        res
          .status(400)
          .json({ message: `Error in deleting tweet id ${tweet_id}!..` });
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
