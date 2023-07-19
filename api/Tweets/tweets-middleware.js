const tweetModel = require("./tweets-model");

const maxCharacter = (req, res, next) => {
  let newTweet = req.body;
  try {
    if (!newTweet) {
      res
        .status(400)
        .json({ message: "Tweet alanı 0 karakterden büyük olmalı!..." });
    } else if (newTweet.length > 140) {
      res
        .status(400)
        .json({ message: "Tweet alanı 140 karakteri geçemez!..." });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const isIdExist = async (req, res, next) => {
  const { tweet_id } = req.params;
  const tweet = await tweetModel.getById(tweet_id);
  if (tweet) {
    req.tweet = tweet;
    next();
  } else {
    next({
      status: 400,
      message: `${tweet_id} id'li tweet bulunamadı!...`,
    });
  }
};

module.exports = { maxCharacter, isIdExist };
