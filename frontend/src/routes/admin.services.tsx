import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/services")({
  head: () => ({ meta: [{ title: "Service Catalog · Admin · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-primary">
          Service Catalog
        </h1>
        <Button className="bg-primary hover:bg-primary/90">Add service</Button>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Dept</th>
              <th className="px-5 py-3">SLA</th>
              <th className="px-5 py-3">Fee</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              ["Birth Certificate", "Public Health", "7d", "₹50", "Live"],
              ["Marriage Certificate", "Revenue", "15d", "₹200", "Live"],
              ["Trade License Renewal", "Revenue", "10d", "Slab", "Live"],
              ["New Water Connection", "Water Works", "30d", "₹1,500", "Draft"],
              [
                "Building Plan Approval",
                "Town Planning",
                "45d",
                "Slab",
                "Live",
              ],
            ].map(([n, d, s, f, st]) => (
              <tr key={n}>
                <td className="px-5 py-3 font-medium">{n}</td>
                <td className="px-5 py-3 text-muted-foreground">{d}</td>
                <td className="px-5 py-3">{s}</td>
                <td className="px-5 py-3">{f}</td>
                <td className="px-5 py-3">
                  <Badge
                    className={
                      st === "Live"
                        ? "bg-emerald/15 text-emerald hover:bg-emerald/15"
                        : "bg-warning/20 text-warning hover:bg-warning/20"
                    }
                  >
                    {st}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  ),
});
