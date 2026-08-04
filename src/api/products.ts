// API для товаров КФХ Кенеш
// Работает с Supabase PostgreSQL

import { supabase } from '../lib/supabase';
import { Product, ProductStatus } from '../types';

// Загрузить все товары
export async function loadProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${supabase.url}/rest/v1/kenesh_products?order=id`,
      { headers: supabase.headers }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((row: any) => ({
      id: row.id.toString(),
      name: row.name,
      price: row.price,
      image: row.image,
      description: row.description,
      status: row.status as ProductStatus,
    }));
  } catch {
    return [];
  }
}

// Сохранить все товары (замена)
export async function saveProducts(products: Product[]): Promise<boolean> {
  try {
    // Удалить все старые
    await fetch(`${supabase.url}/rest/v1/kenesh_products?id=gt.0`, {
      method: 'DELETE',
      headers: supabase.headers,
    });

    // Вставить новые
    const rows = products.map(p => ({
      id: parseInt(p.id),
      name: p.name,
      price: p.price,
      image: p.image,
      description: p.description,
      status: p.status,
    }));

    const res = await fetch(`${supabase.url}/rest/v1/kenesh_products`, {
      method: 'POST',
      headers: supabase.headers,
      body: JSON.stringify(rows),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Обновить один товар
export async function updateProduct(product: Product): Promise<boolean> {
  try {
    const res = await fetch(
      `${supabase.url}/rest/v1/kenesh_products?id=eq.${product.id}`,
      {
        method: 'PATCH',
        headers: supabase.headers,
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          status: product.status,
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

// Добавить товар
export async function addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  try {
    const res = await fetch(`${supabase.url}/rest/v1/kenesh_products`, {
      method: 'POST',
      headers: { ...supabase.headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({
        id: Date.now(),
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        status: product.status,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { ...data[0], id: data[0].id.toString() };
  } catch {
    return null;
  }
}

// Удалить товар
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${supabase.url}/rest/v1/kenesh_products?id=eq.${id}`,
      { method: 'DELETE', headers: supabase.headers }
    );
    return res.ok;
  } catch {
    return false;
  }
}
