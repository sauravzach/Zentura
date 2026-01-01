# Zentura Supabase Setup

This site uses Supabase for secure admin login, content storage, and image uploads. GitHub Pages stays static; Supabase handles auth and data.

## 1) Create a Supabase project
- Go to https://supabase.com and create a new project.
- In Project Settings > API, copy:
  - Project URL
  - Anon public key

Update `config.js` with those values (this is public and safe):
```
window.ZenturaConfig = {
  supabaseUrl: "YOUR_SUPABASE_URL",
  supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",
  loginDomain: "yourdomain.com",
  storageBucket: "zentura-images",
};
```

`loginDomain` lets admins sign in with just the name (the UI appends `@loginDomain`). Set it to the domain part of your admin email.

## 2) Create tables + policies
Run the SQL below in Supabase SQL Editor.

```
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

alter table public.admin_users enable row level security;
create policy "Admin can view self" on public.admin_users
  for select using (auth.uid() = user_id);

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamp with time zone default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  duration text not null,
  price numeric not null,
  currency text default 'INR',
  description text not null,
  highlights text[] default '{}',
  inclusions text[] default '{}',
  exclusions text[] default '{}',
  image_url text,
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  trip text,
  month text,
  message text,
  status text default 'new',
  created_at timestamp with time zone default now()
);

alter table public.site_content enable row level security;
alter table public.trips enable row level security;
alter table public.messages enable row level security;

-- Public read access
create policy "Public read site" on public.site_content for select using (true);
create policy "Public read trips" on public.trips for select using (true);

-- Public can submit inquiries
create policy "Public insert messages" on public.messages for insert with check (true);

-- Admin manage policies
create policy "Admin manage site" on public.site_content
  for insert with check (auth.uid() in (select user_id from public.admin_users));
create policy "Admin update site" on public.site_content
  for update using (auth.uid() in (select user_id from public.admin_users));

create policy "Admin manage trips" on public.trips
  for insert with check (auth.uid() in (select user_id from public.admin_users));
create policy "Admin update trips" on public.trips
  for update using (auth.uid() in (select user_id from public.admin_users));
create policy "Admin delete trips" on public.trips
  for delete using (auth.uid() in (select user_id from public.admin_users));

create policy "Admin read messages" on public.messages
  for select using (auth.uid() in (select user_id from public.admin_users));
create policy "Admin update messages" on public.messages
  for update using (auth.uid() in (select user_id from public.admin_users));
create policy "Admin delete messages" on public.messages
  for delete using (auth.uid() in (select user_id from public.admin_users));
```

## 3) Create the admin user
- Supabase Dashboard > Authentication > Users > Add user.
- Use the admin credentials you want (do not store them in this repo).

Then insert the admin user id into `admin_users`:
```
insert into public.admin_users (user_id)
values ('PASTE_THE_USER_ID_FROM_AUTH_USERS');
```

## 4) Storage for images
- Storage > Create bucket: `zentura-images`
- Set bucket to public (so images can be viewed on the site).

Run this policy SQL:
```
create policy "Public read images" on storage.objects
  for select using (bucket_id = 'zentura-images');

create policy "Admin upload images" on storage.objects
  for insert with check (
    bucket_id = 'zentura-images'
    and auth.uid() in (select user_id from public.admin_users)
  );

create policy "Admin update images" on storage.objects
  for update using (
    bucket_id = 'zentura-images'
    and auth.uid() in (select user_id from public.admin_users)
  );

create policy "Admin delete images" on storage.objects
  for delete using (
    bucket_id = 'zentura-images'
    and auth.uid() in (select user_id from public.admin_users)
  );
```

## 5) Seed content
- Open `admin.html`, log in, and click “Save site content”.
- Add trips and upload images in the trip editor.

## Notes
- The Supabase anon key is public by design. Security comes from RLS policies above.
- Admin edits persist in Supabase and update the public site instantly.
