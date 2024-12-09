/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("competition", (table) => {
    table.increments("id");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.string("name");
    table.string("description");
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("id").inTable("user");
    table.timestamp("end_date").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
