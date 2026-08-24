-- Atomic order processing backing the Paystack webhook (TRD §4.2 + §5.2).
-- A single plpgsql function call is one implicit Postgres transaction, so
-- the claim + both capacity-checked increments + any rollback all commit or
-- roll back together — no read-then-write race, and no way for the webhook
-- handler's own retries/duplicate deliveries to double-process an order or
-- double-count a session's seats_sold.
--
-- Returns one of: 'already_processed' | 'success' | 'oversold_conflict'.
create or replace function process_paystack_order(p_order_id uuid)
returns table(status text)
language plpgsql
as $$
declare
  v_order orders%rowtype;
  v_ticket ticket_types%rowtype;
  v_match_id uuid;
  v_ok boolean := true;
  v_match_incremented boolean := false;
  v_showing_incremented boolean := false;
begin
  -- Exclusive claim: only the webhook delivery that wins this update
  -- proceeds. A retried/duplicate delivery finds payment_status already
  -- flipped and exits here.
  update orders set payment_status = 'success'
  where id = p_order_id and payment_status = 'pending'
  returning * into v_order;

  if not found then
    return query select 'already_processed'::text;
    return;
  end if;

  select * into v_ticket from ticket_types where id = v_order.ticket_type_id;

  if v_ticket.includes_match then
    select id into v_match_id from sessions where type = 'match' limit 1;

    update sessions set seats_sold = seats_sold + v_order.quantity
    where id = v_match_id
      and (capacity is null or seats_sold + v_order.quantity <= capacity);

    if found then
      v_match_incremented := true;
    else
      v_ok := false;
    end if;
  end if;

  if v_ok and v_ticket.includes_showing then
    update sessions set seats_sold = seats_sold + v_order.quantity
    where id = v_order.showing_id
      and (capacity is null or seats_sold + v_order.quantity <= capacity);

    if found then
      v_showing_incremented := true;
    else
      v_ok := false;
    end if;
  end if;

  if v_ok then
    update orders set paid_at = now() where id = p_order_id;
    return query select 'success'::text;
  else
    -- Undo any partial increment this same call already made, so a
    -- refunded/oversold order never leaves a phantom seat counted.
    if v_match_incremented then
      update sessions set seats_sold = seats_sold - v_order.quantity where id = v_match_id;
    end if;
    if v_showing_incremented then
      update sessions set seats_sold = seats_sold - v_order.quantity where id = v_order.showing_id;
    end if;
    update orders set payment_status = 'oversold_conflict' where id = p_order_id;
    return query select 'oversold_conflict'::text;
  end if;
end;
$$;
