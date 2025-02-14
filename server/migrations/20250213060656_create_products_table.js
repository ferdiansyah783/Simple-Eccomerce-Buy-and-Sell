/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("products", function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.decimal('price', 14, 2).notNullable(); // Harga produk
    table.integer('stock').defaultTo(0); // Jumlah stok produk
    table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('CASCADE');
    table.timestamps(true, true);
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("products");
}
