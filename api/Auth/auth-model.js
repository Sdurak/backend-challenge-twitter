const db = require("../../data/db-config");

function getByFilter(filter) {
  const filtered = db("Users as u")
    .leftJoin("Roles as r", "u.role_id", "r.role_id")
    .leftJoin("Relations as re", "u.user_id", "re.user_id")
    .select(
      "u.user_id",
      "u.user_name",
      "u.email",
      "u.first_name",
      "u.last_name",
      "u.created_at",
      "u.password",
      "r.role_id",
      "r.role_name",
      "re.following_id",
      "re.follower_id"
    )
    .where(filter);
  return filtered;
}

module.exports = { getByFilter };
