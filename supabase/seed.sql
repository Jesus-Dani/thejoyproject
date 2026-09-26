-- The Joy Project: seed data (run once against a fresh database)

-- COMBO and FRIDAY_ONLY are kept for historical orders' FK reference but are
-- no longer sold (see checkout/init/route.ts and ticketTypes.ts) — the
-- Charity Match already happened. Existing match orders stay tagged as
-- match (not relabeled as donations).
insert into ticket_types (code, name, price_ngn, includes_match, includes_showing)
values
  ('COMBO', '2-Day Combo', 2200, true, true),
  ('FRIDAY_ONLY', 'Friday Match: Single Day', 1000, true, false),
  ('SATURDAY_ONLY', 'Saturday Showing: Single Day', 1500, false, true)
on conflict (code) do nothing;

-- Friday, Sept 25 2026: Charity Match, Main Field, uncapped.
-- End time is an estimate (2h duration assumed); adjust if the organizers
-- confirm a different match length.
insert into sessions (type, name, film_title, event_date, start_time, end_time, venue, capacity, display_order)
values
  ('match', 'Charity Match', null, '2026-09-25', '13:00', '15:00', 'Main Field', null, 1);

-- Saturday, Sept 26 2026: Barbie Movie Marathon, SEAP, 100 seats/showing.
-- The original 10:00 AM start was cancelled and all three showings pushed
-- later same-day. Showing 1 was rescheduled again same-day to 1:20-2:50 PM
-- (organizer's explicit call, made aware it overlaps Showing 2's window).
insert into sessions (type, name, film_title, event_date, start_time, end_time, venue, capacity, display_order)
values
  ('movie_showing', 'Showing 1', 'Barbie: Princess Charm School', '2026-09-26', '13:20', '14:50', 'SEAP', 100, 2),
  ('movie_showing', 'Showing 2', 'Barbie: The Princess & the Popstar', '2026-09-26', '13:40', '14:50', 'SEAP', 100, 3),
  ('movie_showing', 'Showing 3', 'Barbie and the Secret Door', '2026-09-26', '15:00', '16:30', 'SEAP', 100, 4);
