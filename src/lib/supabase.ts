// Supabase config для КФХ Кенеш
// Хранение заказов в облаке (вместо localStorage)

const SUPABASE_URL = 'https://wyfwofsotrijlahoupau.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5ZndvZnNvdHJpamxhaG91cGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0MzA4OTcsImV4cCI6MjEwMDAwNjg5N30.FHxzFRElAxqUNkYTiGNo8PtOcRtRNw44CSIJr_SAGMg';

export const supabase = {
  url: SUPABASE_URL,
  key: SUPABASE_KEY,
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  },
};
