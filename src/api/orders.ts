// API для заказов КФХ Кенеш
// Работает с Supabase PostgreSQL

import { supabase } from '../lib/supabase';

export interface Order {
  id: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  address: string;
  phone: string;
  time: string;
  status: 'new' | 'done';
}

// Загрузить все заказы
export async function loadOrders(): Promise<Order[]> {
  try {
    const res = await fetch(
      `${supabase.url}/rest/v1/kenesh_orders?order=created_at.desc`,
      { headers: supabase.headers }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((row: any) => ({
      id: row.id.toString(),
      items: row.items,
      total: row.total,
      address: row.address,
      phone: row.phone,
      time: row.time,
      status: row.status,
    }));
  } catch {
    return [];
  }
}

// Сохранить новый заказ
export async function saveOrder(order: Omit<Order, 'id'>): Promise<boolean> {
  try {
    const res = await fetch(`${supabase.url}/rest/v1/kenesh_orders`, {
      method: 'POST',
      headers: supabase.headers,
      body: JSON.stringify({
        items: order.items,
        total: order.total,
        address: order.address,
        phone: order.phone,
        time: order.time,
        status: order.status,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Обновить статус заказа
export async function updateOrderStatus(id: string, status: 'new' | 'done'): Promise<boolean> {
  try {
    const res = await fetch(
      `${supabase.url}/rest/v1/kenesh_orders?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: supabase.headers,
        body: JSON.stringify({ status }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}
