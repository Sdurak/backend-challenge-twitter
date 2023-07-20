const userModel = require("./api/Users/users-model");
const db = require("./data/db-config");

const newUser = {
  first_name: "abuzer",
  last_name: "last",
  password: "5555",
  email: "abuzer@last.com",
  user_name: "abuzittin",
};

beforeAll(async () => {
  ////her testin öncesinde çalışıyor, datayı sıfırlayıp datada kirli bilgi bırakmıyor.
  await db.migrate.rollback();
  await db.migrate.latest();
});

test("Sanity check", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

// describe("Success Testleri");
