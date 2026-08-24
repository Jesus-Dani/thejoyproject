import type { Metadata } from "next";
import CheckinScanner from "./CheckinScanner";

export const metadata: Metadata = { title: "Check-in — The Joy Project" };

export default function CheckinPage() {
  return <CheckinScanner />;
}
