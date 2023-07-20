const jwt = require("jsonwebtoken");
const db = require("../data/db-config");

async function logout(token) {
  await db("TokenBlackList").insert({ token: token });
}
function deleteFromBlackListToken(token) {
  return db("TokenBlackList").where("token", token).del();
}
function checkIsInsertBlackList(token) {
  return db("TokenBlackList").where("token", token).first();
}

module.exports = {
  logout,
  deleteFromBlackListToken,
  checkIsInsertBlackList,
};
