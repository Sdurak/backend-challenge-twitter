/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const defaultRoles = [
  { role_id: 1, role_name: "Blue Tick" },
  { role_id: 2, role_name: "Blue Ticksiz" },
];

const defaultUsers = [
  {
    user_id: 1,
    user_name: "segdi",
    email: "seg@di.com",
    first_name: "segah",
    last_name: "durak",
    password: 1234,
    role_id: 2,
  },
  {
    user_id: 2,
    user_name: "glnyrdm",
    email: "gln@gln.com",
    first_name: "gülin",
    last_name: "yardımoğlu",
    password: 4321,
    role_id: 1,
  },
  {
    user_id: 3,
    user_name: "ilginokd",
    email: "ilgin@okd.com",
    first_name: "ılgın",
    last_name: "ökdem",
    password: 4444,
    role_id: 1,
  },
];

const defaultType = [
  { type_id: 1, tweet_type: "Tweet" },
  { type_id: 2, tweet_type: "Retweet" },
];

const defaultTweets = [
  {
    tweet_id: 1,
    content: "üç küçük şişe sallanıyor...",
    user_id: 3,
    type_id: 1,
  },
  { tweet_id: 2, content: "ölmek var gömlek yok...", user_id: 2, type_id: 1 },
  { tweet_id: 3, content: "ölmek var gömlek yok...", user_id: 1, type_id: 2 },
];

const defaultRelations = [
  { relation_id: 1, following_id: 1, follower_id: 2 },
  { relation_id: 2, following_id: 2, follower_id: 1 },
  { relation_id: 3, following_id: 1, follower_id: 3 },
];

exports.seed = async function (knex) {
  await knex.raw("PRAGMA foreign_keys = OFF");

  await knex("Roles").truncate();
  await knex("Users").truncate();
  await knex("Type").truncate();
  await knex("Tweets").truncate();
  await knex("Relations").truncate();

  await knex.raw("PRAGMA foreign_keys = ON");

  await knex("Roles").insert(defaultRoles);
  await knex("Users").insert(defaultUsers);
  await knex("Type").insert(defaultType);
  await knex("Tweets").insert(defaultTweets);
  await knex("Relations").insert(defaultRelations);
};
