-- ============================================
-- Таблица заказов КФХ Кенеш
-- Выполнить в Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS kenesh_orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    items JSONB NOT NULL,
    total INTEGER NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    consent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_kenesh_orders_status ON kenesh_orders(status);
CREATE INDEX IF NOT EXISTS idx_kenesh_orders_created ON kenesh_orders(created_at);

-- Права доступа (anon can read/write for the website)
ALTER TABLE kenesh_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON kenesh_orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON kenesh_orders
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous update" ON kenesh_orders
    FOR UPDATE USING (true);
