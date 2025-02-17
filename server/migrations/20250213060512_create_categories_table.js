/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("categories", function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.timestamps(true, true);
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("categories");
}
