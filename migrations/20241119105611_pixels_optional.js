export function up(knex) {
  return knex.schema
    .createTable("user", (table) => {
      table.increments("id");
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
    })
    .createTable("camera", (table) => {
      table.increments("id");
      table.string("camera_model").notNullable();
      table.integer("camera_year", 4).notNullable();
      table.string("camera_brand").notNullable();
    })
    .createTable("post", (table) => {
      table.increments("id");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.integer("user_id").unsigned().notNullable();
      table.string("title", 30).notNullable();
      table.integer("like").unsigned().defaultTo(0);
      table.integer("comment_count").unsigned().defaultTo(0);
      table.string("content");
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
    .createTable("comment", (table) => {
      table.increments("id");
      table.integer("post_id").unsigned().notNullable();
      table
        .foreign("post_id")
        .references("id")
        .inTable("post")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.integer("user_id").unsigned().notNullable();
      table
        .foreign("user_id")
        .references("id")
        .inTable("user")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("comment").notNullable();
    });
}

export function down(knex) {
  return knex.schema
    .dropTable("comment")
    .dropTable("post")
    .dropTable("camera")
    .dropTable("user");
}
