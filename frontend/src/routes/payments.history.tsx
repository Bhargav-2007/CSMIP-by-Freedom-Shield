import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const Route = createFileRoute("/payments/history")({
  head: () => ({ meta: [{ title: "Payment history · NagarSeva" }] }),
  component: () => (
    <Card className="overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-5 py-3">Date</th>
            <th className="px-5 py-3">Item</th>
            <th className="px-5 py-3">Amount</th>
            <th className="px-5 py-3">Mode</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[
            ["12 Feb 2025", "Property Tax Q3", "₹12,120", "UPI · PhonePe"],
            ["05 Jan 2025", "Water Dec", "₹780", "UPI · GPay"],
            ["18 Dec 2024", "Drainage Dec", "₹310", "Net Banking"],
            ["02 Nov 2024", "Property Tax Q2", "₹12,120", "Card"],
            ["10 Oct 2024", "Trade License", "₹5,000", "UPI"],
          ].map(([d, n, a, m]) => (
            <tr key={d + n}>
              <td className="px-5 py-3 text-muted-foreground">{d}</td>
              <td className="px-5 py-3">{n}</td>
              <td className="px-5 py-3 font-medium">{a}</td>
              <td className="px-5 py-3 text-muted-foreground">{m}</td>
              <td className="px-5 py-3 text-right">
                <Button size="sm" variant="ghost">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Receipt
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  ),
});
