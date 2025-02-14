import knex from 'knex';
import { development } from '../../knexfile.js';
const db = knex(development)

// Fungsi untuk mendapatkan kategori produk
export async function getCategories(req, res) {
  try {
    const categories = await db('categories').select('*');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
}
