-- Backfill profiles for existing users
insert into public.profiles (id)
select id from auth.users
where id not in (select id from public.profiles); 