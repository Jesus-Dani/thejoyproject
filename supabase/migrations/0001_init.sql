-- The Joy Project — initial schema (TRD §3)
create extension if not exists "pgcrypto";

create type session_type as enum ('match', 'movie_showing');
create type ticket_type_code as enum ('COMBO', 'FRIDAY_ONLY', 'SATURDAY_ONLY');
create type order_payment_status as enum ('pending', 'success', 'failed', 'oversold_conflict');

create table sessions (
  id uuid primary key default gen_random_uuid(),
  type session_type not null,
  name text not null,
  film_title text,
  event_date date not null,
  start_time time not null,
  end_time time not null,
  venue text not null,
  capacity int,
  seats_sold int not null default 0,
  display_order int not null default 0,
  constraint seats_sold_within_capacity check (capacity is null or seats_sold <= capacity),
  constraint seats_sold_non_negative check (seats_sold >= 0)
);

create table ticket_types (
  id uuid primary key default gen_random_uuid(),
  code ticket_type_code not null unique,
  name text not null,
  price_ngn numeric not null,
  includes_match boolean not null default false,
  includes_showing boolean not null default false
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text not null,
  ticket_type_id uuid not null references ticket_types(id),
  showing_id uuid references sessions(id),
  quantity int not null check (quantity > 0),
  unit_price_ngn numeric not null,
  paystack_fee_ngn numeric,
  total_amount_ngn numeric not null,
  paystack_reference text not null unique,
  payment_status order_payment_status not null default 'pending',
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index orders_payment_status_idx on orders(payment_status);
create index orders_created_at_idx on orders(created_at desc);

create table admissions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id),
  session_id uuid not null references sessions(id),
  qr_token text not null unique,
  checked_in_at timestamptz,
  checked_in_by text
);

create index admissions_order_id_idx on admissions(order_id);
create index admissions_session_id_idx on admissions(session_id);

-- No client-side access: RLS stays default-deny. Every read/write goes
-- through server-side API routes using the Supabase service-role key.
alter table sessions enable row level security;
alter table ticket_types enable row level security;
alter table orders enable row level security;
alter table admissions enable row level security;
