/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("Roles", (tbl) => {
      tbl.increments("role_id");
      tbl.string("role_name").notNullable();
    })
    .createTable("Users", (tbl) => {
      tbl.increments("user_id");
      tbl.string("user_name").notNullable().unique();
      tbl.string("email").notNullable().unique();
      tbl.string("first_name", 128).notNullable();
      tbl.string("last_name", 128).notNullable();
      tbl.string("password").notNullable();
      tbl.dateTime("created_at").defaultTo(knex.fn.now());
      tbl
        .integer("role_id")
        .references("role_id")
        .inTable("Roles")
        .onDelete("RESTRICT")
        .defaultTo(2);
    })
    .createTable("Type", (tbl) => {
      tbl.increments("type_id");
      tbl.string("tweet_type").defaultTo(1);
    })

    .createTable("Tweets", (tbl) => {
      tbl.increments("tweet_id");
      tbl.dateTime("created_at").defaultTo(knex.fn.now());
      tbl.string("content").notNullable();
      tbl
        .integer("user_id")
        .references("user_id")
        .inTable("Users")
        .onDelete("RESTRICT");
      tbl
        .integer("type_id")
        .references("type_id")
        .inTable("Type")
        .onDelete("RESTRICT");
    })
    .createTable("Relations", (tbl) => {
      tbl.increments("relation_id");
      tbl
        .integer("following_id")
        .references("user_id")
        .inTable("Users")
        .onDelete("RESTRICT");
      tbl
        .integer("follower_id")
        .references("user_id")
        .inTable("Users")
        .onDelete("RESTRICT");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("Relations")
    .dropTableIfExists("Tweets")
    .dropTableIfExists("Type")
    .dropTableIfExists("Users")
    .dropTableIfExists("Roles");
};
