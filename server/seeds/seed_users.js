/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      name: "Admin",
      email: "admin@example.com",
      password: "$2a$10$H8qWQIbkD.zEecD7f4.ljuLvyUvtME.HrN4JtRXsIt1zLD//.04Cy",
      role: "admin",
      address: "Jl. Admin",
    },
    {
      name: "Customer 1",
      email: "customer1@example.com",
      password: "$2a$10$H8qWQIbkD.zEecD7f4.ljuLvyUvtME.HrN4JtRXsIt1zLD//.04Cy",
      role: "customer",
      address: "Jl. Customer 1",
    },
    {
      name: "Customer 2",
      email: "customer2@example.com",
      password: "$2a$10$H8qWQIbkD.zEecD7f4.ljuLvyUvtME.HrN4JtRXsIt1zLD//.04Cy",
      role: "customer",
      address: "Jl. Customer 2",
    },
  ]);
}
