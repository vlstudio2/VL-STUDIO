-- Jalankan di Supabase SQL Editor setelah meninjau kebijakan keamanan.
create table if not exists public.maps (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 category text,
 description text,
 image_urls text[] not null default '{}',
 roblox_url text,
 is_published boolean not null default true,
 sort_order int not null default 0,
 created_at timestamptz not null default now()
);
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 category text,
 description text,
 price numeric(12,2),
 image_urls text[] not null default '{}',
 stock int,
 is_published boolean not null default true,
 created_at timestamptz not null default now()
);
create table if not exists public.team_members (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 role text not null,
 bio text,
 image_url text,
 sort_order int not null default 0,
 is_published boolean not null default true
);
create table if not exists public.site_links (
 id uuid primary key default gen_random_uuid(),
 label text not null,
 url text not null,
 section text not null default 'support'
);
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(),
 customer_name text not null,
 customer_email text,
 items jsonb not null,
 total numeric(12,2) not null,
 payment_status text not null default 'pending',
 payment_reference text,
 created_at timestamptz not null default now()
);
-- RLS harus diaktifkan sebelum produksi. Jangan memberi akses tulis publik.
alter table public.maps enable row level security;
alter table public.products enable row level security;
alter table public.team_members enable row level security;
alter table public.site_links enable row level security;
alter table public.orders enable row level security;
-- Kebijakan SELECT publik untuk konten yang dipublikasikan.
create policy "Public can view published maps" on public.maps for select using (is_published = true);
create policy "Public can view published products" on public.products for select using (is_published = true);
create policy "Public can view published team" on public.team_members for select using (is_published = true);
create policy "Public can view support links" on public.site_links for select using (section = 'support');
-- Tambahkan policy INSERT/UPDATE/DELETE khusus Owner setelah konfigurasi auth & verifikasi allowlist.
-- Jangan mengaktifkan akses tulis anonim.
