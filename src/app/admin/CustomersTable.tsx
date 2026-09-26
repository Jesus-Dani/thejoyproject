"use client";

import { useMemo, useState } from "react";
import { NGN } from "@/lib/constants";

export type Customer = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  booking: string;
  quantity: number;
  totalAmountNgn: number;
};

type SortKey = "buyerName" | "buyerEmail" | "buyerPhone" | "booking" | "quantity" | "totalAmountNgn";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "buyerName", label: "Name" },
  { key: "buyerEmail", label: "Email" },
  { key: "buyerPhone", label: "Phone" },
  { key: "booking", label: "Booking" },
  { key: "quantity", label: "Qty" },
  { key: "totalAmountNgn", label: "Amount" },
];

export default function CustomersTable({ customers }: { customers: Customer[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("booking");
  const [ascending, setAscending] = useState(true);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setAscending((a) => !a);
    } else {
      setSortKey(key);
      setAscending(true);
    }
  }

  const sorted = useMemo(() => {
    const copy = [...customers];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return ascending ? cmp : -cmp;
    });
    return copy;
  }, [customers, sortKey, ascending]);

  return (
    <div className="mt-4 overflow-x-auto rounded-card border border-navy/10 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-navy/10 text-navy/60">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold">
                <button
                  type="button"
                  onClick={() => toggleSort(col.key)}
                  className="inline-flex items-center gap-1 hover:text-navy"
                >
                  {col.label}
                  {sortKey === col.key && <span aria-hidden="true">{ascending ? "▲" : "▼"}</span>}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-navy/50" colSpan={COLUMNS.length}>
                No confirmed orders yet.
              </td>
            </tr>
          ) : (
            sorted.map((c) => (
              <tr key={c.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{c.buyerName}</td>
                <td className="px-4 py-3 text-navy/70">{c.buyerEmail}</td>
                <td className="px-4 py-3 text-navy/70">{c.buyerPhone}</td>
                <td className="px-4 py-3 text-navy/70">{c.booking}</td>
                <td className="px-4 py-3 text-navy/70">{c.quantity}</td>
                <td className="px-4 py-3 text-navy/70">{NGN.format(c.totalAmountNgn)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
