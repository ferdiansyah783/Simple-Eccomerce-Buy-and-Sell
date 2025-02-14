/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("orders", function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.decimal('total_price', 14, 2).notNullable();
    table.enum('status', ['pending', 'completed', 'cancelled']).defaultTo('pending'); // Status order
    table.string('payment_method').notNullable();
    table.string('address').notNullable();
    table.timestamps(true, true);
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("orders");
}
