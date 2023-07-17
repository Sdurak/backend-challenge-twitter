const db = require("../../data/db-config");

const getAll = () => {
  return db("Users as u")
    .leftJoin("Roles as r", "u.role_id", "r.role_id")
    .leftJoin("Relations as re", "u.user_id", "re.user_id")
    .select(
      "u.user_id",
      "u.user_name",
      "u.email",
      "u.first_name",
      "u.last_name",
      "u.created_at",
      "r.role_id",
      "r.role_name",
      "re.following_id",
      "re.follower_id"
    );
};

async function getById(user_id) {
  const user = await db("Users as u")
    .leftJoin("Roles as r", "u.role_id", "r.role_id")
    .leftJoin("Relations as re", "u.user_id", "re.user_id")
    .select(
      "u.user_id",
      "u.user_name",
      "u.email",
      "u.first_name",
      "u.last_name",
      "u.created_at",
      "r.role_id",
      "r.role_name",
      "re.following_id",
      "re.follower_id"
    )
    .where("u.user_id", user_id) //==where({user_id:user_id})
    .first();
  return user;
}
async function getByFilter(filter) {
  const filtered = await db("Users as u")
    .leftJoin("Roles as r", "u.role_id", "r.role_id")
    .leftJoin("Relations as re", "u.user_id", "re.user_id")
    .select(
      "u.user_id",
      "u.user_name",
      "u.email",
      "u.first_name",
      "u.last_name",
      "u.created_at",
      "r.role_id",
      "r.role_name",
      "re.following_id",
      "re.follower_id"
    )
    .where(filter);
  return filtered;
}
const getByName = (user_name) => {
  return db("Users").where({ user_name: user_name }).first();
};

const create = async (newUser) => {
  let [user_id] = await db("Users").insert(newUser);
  return getById(user_id);
};

const update = async (user_id, user) => {
  await db("Users").where({ user_id: user_id }).update(user);
  return getById(user_id);
};

const remove = async (user_id) => {
  return await db("Users").where({ user_id: user_id }).delete();
};

module.exports = {
  getAll,
  getByFilter,
  getById,
  getByName,
  create,
  update,
  remove,
};
