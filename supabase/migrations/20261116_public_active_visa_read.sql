-- DunyaTrip: allow the public website to read ONLY active visa catalogue rows.
-- Run this in Supabase SQL Editor for project czmfvupgvnesxfdfkdpn.
-- This does not expose other admin_records modules or inactive visas.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_records'
      and policyname = 'Public can read active visa catalogue'
  ) then
    create policy "Public can read active visa catalogue"
      on public.admin_records
      for select
      to anon, authenticated
      using (
        module_key = 'administration/visa-management'
        and status = 'Active'
        and payload ->> 'Status' = 'Active'
      );
  end if;
end
$$;

-- Ensure Row Level Security is enabled; this does not remove existing policies.
alter table public.admin_records enable row level security;
