-- DunyaTrip website form submissions
-- Run this in Supabase SQL Editor after reviewing the existing enquiries policies.
-- This adds INSERT-only access for anonymous website visitors.
-- It does not grant public SELECT, UPDATE, or DELETE and does not change admin policies.

GRANT INSERT ON TABLE public.enquiries TO anon;

DROP POLICY IF EXISTS "Public website can submit enquiries"
ON public.enquiries;

CREATE POLICY "Public website can submit enquiries"
ON public.enquiries
FOR INSERT
TO anon
WITH CHECK (
  customer_name IS NOT NULL
  AND length(trim(customer_name)) BETWEEN 1 AND 120
  AND phone IS NOT NULL
  AND length(trim(phone)) BETWEEN 5 AND 40
  AND service_type IN ('Visa', 'Flights', 'Hotels', 'Umrah', 'B2B', 'Other')
  AND (message IS NULL OR length(message) <= 5000)
);

-- Deliberately no anon SELECT/UPDATE/DELETE grants or policies.
