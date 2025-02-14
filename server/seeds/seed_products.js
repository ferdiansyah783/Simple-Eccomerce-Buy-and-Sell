/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed (knex) {
  // Deletes ALL existing entries
  await knex("products").del();
  await knex("products").insert([
    {
      name: "Smartphone XYZ",
      description: "Smartphone dengan layar 6.5 inci",
      price: 5000000,
      stock: 50,
      category_id: 1,
    },
    {
      name: "Laptop ABC",
      description: "Laptop dengan prosesor Intel i7",
      price: 10000000,
      stock: 20,
      category_id: 1,
    },
    {
      name: "T-Shirt Casual",
      description: "Kaos santai pria",
      price: 150000,
      stock: 100,
      category_id: 2,
    },
    {
      name: "Blender Multifungsi",
      description: "Blender serbaguna untuk keperluan dapur",
      price: 350000,
      stock: 30,
      category_id: 3,
    },
  ]);
}
