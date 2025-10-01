-- Create orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  klarna_order_id text not null,
  customer_email text not null,
  amount bigint not null,
  currency text not null default 'SEK',
  status text not null default 'pending',
  order_lines jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.orders enable row level security;

-- Create policies
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Service role can create orders"
  on public.orders for insert
  to service_role
  with check (true);

create policy "Service role can update orders"
  on public.orders for update
  to service_role
  using (true);

-- Create updated_at trigger
create trigger set_updated_at
  before update on public.orders
  for each row
  execute function public.set_updated_at();