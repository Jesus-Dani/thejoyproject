import { TICKET_PRICES } from "./constants";

export type TicketTypeCode = "COMBO" | "FRIDAY_ONLY" | "SATURDAY_ONLY";

// The Charity Match (Friday) already happened, so COMBO and FRIDAY_ONLY are
// no longer sold — only the Saturday showing ticket remains purchasable.
// Both rows still exist in the `ticket_types` table (existing orders
// reference them by FK) and checkout/init rejects them server-side too.
export const TICKET_TYPES: Array<{
  code: TicketTypeCode;
  name: string;
  priceNgn: number;
  includesMatch: boolean;
  includesShowing: boolean;
  blurb: string;
}> = [
  {
    code: "SATURDAY_ONLY",
    name: "Saturday: Barbie Marathon",
    priceNgn: TICKET_PRICES.SATURDAY_ONLY,
    includesMatch: false,
    includesShowing: true,
    blurb: "One showing of your choice. Free drink and popcorn.",
  },
];
