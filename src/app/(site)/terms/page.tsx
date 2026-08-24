import type { Metadata } from "next";
import HandDrawnUnderline from "@/components/ui/HandDrawnUnderline";

export const metadata: Metadata = { title: "Terms & FAQ — The Joy Project" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-extrabold text-navy">{title}</h2>
      <div className="mt-3 space-y-3 text-navy/80">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-10 md:py-20">
      <h1 className="text-4xl font-extrabold text-navy sm:text-5xl">terms &amp; faq</h1>
      <HandDrawnUnderline color="blue" className="mt-3 w-32" />

      <Section title="No refunds">
        <p>
          All ticket sales are final. We don&rsquo;t offer refunds, transfers,
          or exchanges once a purchase is complete — please double-check
          your ticket type and showing selection before paying.
        </p>
        <p>
          The one exception is entirely on us: in the rare case a Saturday
          showing sells out in the seconds between you starting checkout and
          your payment clearing, we automatically refund you in full and
          email you to explain what happened. This isn&rsquo;t a general
          refund option — it only ever triggers automatically, and only for
          that specific situation.
        </p>
      </Section>

      <Section title="Tickets">
        <p>
          Tickets are general admission — there&rsquo;s no assigned seating.
          A Saturday-inclusive ticket (single-day or combo) admits you to
          the one showing you selected at checkout, not all three.
        </p>
        <p>
          Your ticket is tied to the QR code emailed to you after payment.
          It&rsquo;s single-use — once scanned at the door, it can&rsquo;t be
          used again, so don&rsquo;t share screenshots of it.
        </p>
      </Section>

      <Section title="Privacy">
        <p>
          We collect your name, email, and phone number to process your
          order, send your ticket, and reach you if there&rsquo;s a problem
          with your booking. We don&rsquo;t sell or share this information
          with third parties beyond what&rsquo;s required to run the event
          (e.g. Paystack for payment processing).
        </p>
        <p>
          Payment details are handled entirely by Paystack — we never see or
          store your card information.
        </p>
      </Section>

      <Section title="Liability">
        <p>
          Attendance at the Barbie Movie Marathon and the Charity Match is
          at your own risk. The Joy Project and its organizers aren&rsquo;t
          liable for personal injury, loss, or damage to property at either
          event, except where caused by our negligence.
        </p>
      </Section>

      <Section title="FAQ">
        <p>
          <strong className="text-navy">Can I bring a friend without a ticket?</strong>
          <br />
          Everyone attending needs their own ticket — quantity isn&rsquo;t
          capped, so grab as many as you need in one order.
        </p>
        <p>
          <strong className="text-navy">What if I lose my QR code email?</strong>
          <br />
          Check your spam folder first. Beyond that, reach out via the email
          in our footer with your order details.
        </p>
        <p>
          <strong className="text-navy">Is Meet &amp; Shop ticketed?</strong>
          <br />
          No — the RUN Marketplace pop-up is free and open to everyone, no
          ticket required.
        </p>
      </Section>
    </div>
  );
}
