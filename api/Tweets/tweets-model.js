const db = require("../../data/db-config");

const getAll = () => {
  return db("Tweets as t")
    .leftjoin("Users as u", "u.user_id", "t.user_id")
    .leftjoin("Type as ty", "t.type_id", "ty.type_id")
    .select(
      "u.user_id",
      "u.user_name",
      "t.tweet_id",
      "t.created_at",
      "t.content",
      "ty.type_id",
      "ty.tweet_type"
    );
};

async function getById(tweet_id) {
  const tweet = await db("Tweets as t")
    .leftjoin("Users as u", "u.user_id", "t.user_id")
    .leftjoin("Type as ty", "t.type_id", "ty.type_id")
    .select(
      "u.user_id",
      "u.user_name",
      "t.tweet_id",
      "t.created_at",
      "t.content",
      "ty.type_id",
      "ty.tweet_type"
    )
    .where("t.tweet_id", tweet_id) //==where({tweet_id:tweet_id})
    .first();
  return tweet;
}
async function getByFilter(filter) {
  const filtered = await db("Tweets as t")
    .leftjoin("Users as u", "u.user_id", "t.user_id")
    .leftjoin("Type as ty", "t.type_id", "ty.type_id")
    .select(
      "u.user_id",
      "u.user_name",
      "t.tweet_id",
      "t.created_at",
      "t.content",
      "ty.type_id",
      "ty.tweet_type"
    )
    .where(filter);
  return filtered;
}

const create = async (newTweet) => {
  let [tweet_id] = await db("Tweets").insert(newTweet);
  return getById(tweet_id);
};

const update = async (tweet_id, tweet) => {
  await db("Tweets").where({ tweet_id: tweet_id }).update(tweet);
  return getById(tweet_id);
};

const remove = async (tweet_id) => {
  return await db("Tweets").where({ tweet_id: tweet_id }).delete();
};

module.exports = { getAll, getByFilter, getById, create, update, remove };
