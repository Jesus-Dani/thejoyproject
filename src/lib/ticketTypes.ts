import { TICKET_PRICES } from "./constants";

export type TicketTypeCode = "COMBO" | "FRIDAY_ONLY" | "SATURDAY_ONLY";

export const TICKET_TYPES: Array<{
  code: TicketTypeCode;
  name: string;
  priceNgn: number;
  includesMatch: boolean;
  includesShowing: boolean;
  blurb: string;
}> = [
  {
    code: "COMBO",
    name: "2-Day Combo",
    priceNgn: TICKET_PRICES.COMBO,
    includesMatch: true,
    includesShowing: true,
    blurb: "Friday match + one Saturday showing of your choice. Free drink and popcorn at the movies.",
  },
  {
    code: "FRIDAY_ONLY",
    name: "Friday: Charity Match",
    priceNgn: TICKET_PRICES.FRIDAY_ONLY,
    includesMatch: true,
    includesShowing: false,
    blurb: "Match day only",
  },
  {
    code: "SATURDAY_ONLY",
    name: "Saturday: Barbie Marathon",
    priceNgn: TICKET_PRICES.SATURDAY_ONLY,
    includesMatch: false,
    includesShowing: true,
    blurb: "One showing of your choice. Free drink and popcorn.",
  },
];
