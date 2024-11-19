export function up(knex) {
  return knex.schema
    .createTable("user", (table) => {
      table.increments("id");
      table.string("name").notNullable();
      table.string("email").notNullable();
    })
    .createTable("post", (table) => {
      table.increments("id");
      table.integer("user_id").unsigned().notNullable();
      table.string("title", 30).notNullable();
      table.string("content").notNullable();
      table.string("image_url").notNullable();
      table.integer("camera_id").unsigned().notNullable();
      table.foreign("camera_id").references("id").inTable("camera");
      table
        .foreign("user_id")
        .references("id")
        .inTable("user")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("camera", (table) => {
      table.increments("id");
      table.string("camera_model").notNullable();
      table.integer("camera_year", 4).notNullable();
      table.string("camera_brand").notNullable();
    });
}

export function down(knex) {
  return knex.schema.dropTable(camera).dropTable("post").dropTable("user");
}
