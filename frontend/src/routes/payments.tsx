import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceForm } from "@/components/site/ServiceForm";
import {
  Home,
  Droplets,
  Waves,
  Briefcase,
  Zap,
  IndianRupee,
  Download,
  ArrowRight,
  FileSpreadsheet,
} from "lucide-react";
import { useState } from "react";
import { downloadReceipt, exportPaymentsToExcel } from "@/lib/exports";
import { usePayments } from "@/lib/store";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Taxes & Utility Payments · CivicHub" },
      {
        name: "description",
        content:
          "Pay property tax, water, drainage, professional tax and municipal fees with UPI.",
      },
      { property: "og:url", content: "/payments" },
    ],
    links: [{ rel: "canonical", href: "/payments" }],
  }),
  component: PaymentsPage,
});

const bills = [
  {
    icon: Home,
    name: "Property Tax",
    ac: "PT/AMC/48-291-337",
    due: "31 Mar 2025",
    amt: "12,480",
    status: "Due in 8 days",
  },
  {
    icon: Droplets,
    name: "Water Bill",
    ac: "WT/AMC/98120",
    due: "18 Apr 2025",
    amt: "820",
    status: "Upcoming",
  },
  {
    icon: Waves,
    name: "Drainage Bill",
    ac: "DR/AMC/98120",
    due: "18 Apr 2025",
    amt: "310",
    status: "Upcoming",
  },
  {
    icon: Briefcase,
    name: "Professional Tax",
    ac: "PROF/23887",
    due: "05 May 2025",
    amt: "2,500",
    status: "Upcoming",
  },
  {
    icon: Zap,
    name: "Trade License Fee",
    ac: "TL-A/00214",
    due: "22 May 2025",
    amt: "5,000",
    status: "Renewal",
  },
];

const fallbackHistory = [
  {
    id: "RCPT-25-2103",
    d: "12 Feb 2025",
    n: "Property Tax · FY24-25 Q3",
    amt: "12,120",
    mode: "UPI · PhonePe",
    state: "Paid",
  },
  {
    id: "RCPT-25-1088",
    d: "05 Jan 2025",
    n: "Water Bill · Dec",
    amt: "780",
    mode: "UPI · GPay",
    state: "Paid",
  },
  {
    id: "RCPT-24-9821",
    d: "18 Dec 2024",
    n: "Drainage · Dec",
    amt: "310",
    mode: "Net Banking",
    state: "Paid",
  },
  {
    id: "RCPT-24-8720",
    d: "02 Nov 2024",
    n: "Property Tax · Q2",
    amt: "12,120",
    mode: "Card",
    state: "Paid",
  },
];

function PaymentsPage() {
  const [openForm, setOpenForm] = useState(false);
  const { data: payments = [] } = usePayments();
  const history =
    payments.length > 0
      ? payments.map((payment) => ({
          id: payment.transaction_id,
          d: payment.paid_at
            ? new Date(payment.paid_at).toLocaleDateString("en-IN")
            : new Date(payment.created_at).toLocaleDateString("en-IN"),
          n: payment.description,
          amt: Number(payment.total_amount).toLocaleString("en-IN"),
          mode: payment.mode.replaceAll("_", " "),
          state: payment.status,
        }))
      : fallbackHistory;

  return (
    <>
      <PageHero
        eyebrow="Payments"
        title="Clear every municipal bill with a single tap."
        intro="UPI, cards, wallets and net banking — with instant, digitally signed receipts synced to your DigiLocker."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-6 md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-primary">
                Your outstanding bills
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenForm(true)}
              >
                Add / Pay by consumer ID
              </Button>
            </div>
            <div className="mt-6 divide-y divide-border">
              {bills.map((b) => (
                <div key={b.name} className="flex items-center gap-4 py-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-medium">{b.name}</div>
                      <Badge variant="secondary" className="text-[10px]">
                        {b.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {b.ac} · Due {b.due}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-semibold text-primary">
                      ₹{b.amt}
                    </div>
                    <Button
                      size="sm"
                      className="mt-1 bg-primary hover:bg-primary/90"
                      onClick={() => setOpenForm(true)}
                    >
                      Pay now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-xl bg-hero-gradient p-5 text-white">
              <div>
                <div className="text-sm opacity-80">Pay all together</div>
                <div className="font-display text-2xl font-semibold">
                  ₹21,110
                </div>
              </div>
              <Button
                className="bg-accent text-primary hover:bg-accent/90"
                onClick={() => setOpenForm(true)}
              >
                Pay all with UPI <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-display text-lg font-semibold text-primary">
                Quick pay
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No login needed. Just enter your consumer ID.
              </p>
              <div className="mt-4 grid gap-2">
                {[
                  "Property Tax",
                  "Water Bill",
                  "Trade License",
                  "Building Fee",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setOpenForm(true)}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm hover:border-accent hover:bg-accent/5"
                  >
                    {q} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </Card>
            <Card className="p-6 bg-secondary/60">
              <h3 className="font-display text-lg font-semibold text-primary">
                Rebate window open
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Pay full-year property tax by 30 April and save up to{" "}
                <span className="font-semibold text-emerald">10%</span>.
              </p>
              <Button className="mt-4 w-full bg-emerald text-white hover:bg-emerald/90">
                Claim rebate
              </Button>
            </Card>
          </div>
        </div>
      </Section>

      {openForm && (
        <Section eyebrow="Payment" title="Pay a municipal bill">
          <ServiceForm
            service="Municipal Bill Payment"
            category="payment"
            idPrefix="PAY"
            fee="As per bill"
            requiredDocs={["Latest bill (PDF, optional)"]}
            fields={[
              {
                name: "billType",
                label: "Bill type",
                type: "select",
                required: true,
                options: [
                  "Property Tax",
                  "Water Bill",
                  "Drainage Bill",
                  "Professional Tax",
                  "Trade License Fee",
                  "Building Fee",
                ],
              },
              {
                name: "consumerId",
                label: "Consumer / Account ID",
                required: true,
                placeholder: "e.g. PT/AMC/48-291-337",
              },
              {
                name: "amount",
                label: "Amount (₹)",
                type: "number",
                required: true,
              },
              {
                name: "mode",
                label: "Payment mode",
                type: "select",
                required: true,
                options: [
                  "UPI",
                  "Debit / Credit Card",
                  "Net Banking",
                  "Wallet",
                ],
              },
              {
                name: "email",
                label: "Email for receipt",
                type: "email",
                required: true,
              },
              { name: "notes", label: "Notes (optional)", type: "textarea" },
            ]}
            intro="You'll get a digitally signed PDF receipt after payment."
          />
        </Section>
      )}

      <Section eyebrow="History" title="Payment history & receipts">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => exportPaymentsToExcel(history)}
          >
            <FileSpreadsheet className="h-4 w-4" /> Export to Excel
          </Button>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Mode</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((h) => (
                  <tr key={h.id}>
                    <td className="px-5 py-3 text-muted-foreground">{h.d}</td>
                    <td className="px-5 py-3">{h.n}</td>
                    <td className="px-5 py-3 font-medium">
                      <IndianRupee className="inline h-3 w-3" />
                      {h.amt}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {h.mode}
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={paymentTone(h.state)}>{h.state}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          downloadReceipt({
                            id: h.id,
                            description: h.n,
                            amount: h.amt,
                            mode: h.mode,
                            date: h.d,
                            payer: "Ramesh Mehta",
                          })
                        }
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>
    </>
  );
}

function paymentTone(status: string) {
  const value = status.toLowerCase();
  if (value === "success" || value === "paid") {
    return "bg-emerald/15 text-emerald hover:bg-emerald/15";
  }

  if (value === "failed" || value === "rejected") {
    return "bg-danger/15 text-danger hover:bg-danger/15";
  }

  return "bg-warning/20 text-warning hover:bg-warning/20";
}
