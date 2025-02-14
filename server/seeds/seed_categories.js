/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed (knex) {
  // Deletes ALL existing entries
  await knex("categories").del();
  await knex("categories").insert([
    {
      name: "Elektronik",
      description: "Produk elektronik seperti ponsel, laptop, dll.",
    },
    { name: "Pakaian", description: "Pakaian untuk pria dan wanita" },
    {
      name: "Peralatan Rumah Tangga",
      description: "Peralatan untuk keperluan rumah tangga",
    },
  ]);
}
