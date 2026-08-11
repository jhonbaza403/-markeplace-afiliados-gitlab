-- Crear tabla de órdenes B2B
create table if not exists public.b2b_orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id text not null,
  product_title text not null,
  supplier_id text,
  quantity integer not null check (quantity > 0),
  unit_price_usd numeric(10,2) not null,
  total_usd numeric(10,2) not null,
  payment_method text not null check (payment_method in ('binance_pay', 'usdt_trc20', 'bank_transfer')),
  binance_tx_id text,
  status text default 'verifying' check (status in ('pending', 'verifying', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS)
alter table public.b2b_orders enable row level security;

-- Políticas de acceso
create policy "Usuarios pueden ver sus propias órdenes B2B"
  on public.b2b_orders for select
  using (auth.uid() = user_id);

create policy "Usuarios pueden registrar sus órdenes B2B"
  on public.b2b_orders for insert
  with check (auth.uid() = user_id);