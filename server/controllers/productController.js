import knex from 'knex';
import { development } from '../../knexfile.js';
const db = knex(development)

// Fungsi untuk mendapatkan produk dengan filter pencarian
export async function getProducts(req, res) {
  try {
    const { category_id, min_price, max_price, search } = req.query;
    let query = db('products')
      .select('products.*', 'categories.id as category_id', 'categories.name as category_name')
      .join('categories', 'products.category_id', 'categories.id');
    
    if (category_id) {
      query = query.where('products.category_id', category_id);
    }
    if (min_price) {
      query = query.where('products.price', '>=', min_price);
    }
    if (max_price) {
      query = query.where('products.price', '<=', max_price);
    }
    if (search) {
      query = query.where('products.name', 'like', `%${search}%`);
    }
    
    const products = await query;
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

// Fungsi untuk menambahkan produk
export async function addProduct(req, res) {
  const { name, description, stock, price, category } = req.body;

  try {
    const categoryCheck = await db('categories').where('name', category).first();
    let categoryId;
    if (categoryCheck) {
      categoryId = categoryCheck.id;
    } else {
      const newCategory = await db('categories').insert({ name: category });
      categoryId = newCategory[0];
    }

    const newProduct = await db('products').insert({
      name,
      description,
      stock,
      price,
      category_id: categoryId
    });
    res.status(201).json({ message: 'Product added successfully', product_id: newProduct[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error adding product' });
  }
}

// Fungsi untuk mengedit produk
export async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, description, price, category, stock } = req.body;

  try {
    const categoryCheck = await db('categories').where('name', category).first();
    let categoryId;
    if (categoryCheck) {
      categoryId = categoryCheck.id;
    } else {
      const newCategory = await db('categories').insert({ name: category });
      categoryId = newCategory[0];
    }

    const product = await db('products').where('id', id).first();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await db('products').where('id', id).update({
      name,
      description,
      price,
      stock,
      category_id: categoryId
    });

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
}

// Fungsi untuk menghapus produk
export async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const product = await db('products').where('id', id).first();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await db('products').where('id', id).del();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
}
