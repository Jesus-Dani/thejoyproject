-- The Joy Project: seed data (run once against a fresh database)

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
insert into sessions (type, name, film_title, event_date, start_time, end_time, venue, capacity, display_order)
values
  ('movie_showing', 'Showing 1', 'Barbie in the Nutcracker', '2026-09-26', '10:00', '12:20', 'SEAP', 100, 2),
  ('movie_showing', 'Showing 2', 'Barbie of Swan Lake', '2026-09-26', '12:35', '14:55', 'SEAP', 100, 3),
  ('movie_showing', 'Showing 3', 'Barbie and the Secret Door', '2026-09-26', '15:10', '17:30', 'SEAP', 100, 4);
