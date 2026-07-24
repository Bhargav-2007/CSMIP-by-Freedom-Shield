import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics · Admin · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-primary mb-6">
        Analytics
      </h1>
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          ["1.2M", "Sessions (30d)"],
          ["₹48Cr", "Payments processed"],
          ["68,410", "Applications"],
          ["4.7 / 5", "CSAT"],
        ].map(([v, l]) => (
          <Card key={l} className="p-5">
            <div className="font-display text-2xl font-semibold text-primary">
              {v}
            </div>
            <div className="text-xs text-muted-foreground">{l}</div>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display font-semibold text-primary">
            Applications processed (12w)
          </h3>
          <div className="mt-4 flex items-end gap-1 h-40">
            {[40, 52, 48, 61, 58, 70, 74, 68, 82, 88, 91, 96].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/80"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-display font-semibold text-primary">
            Top services
          </h3>
          <ul className="mt-4 space-y-3">
            {[
              ["Property tax", 42],
              ["Water bill", 28],
              ["Birth cert", 12],
              ["Complaints", 10],
              ["Others", 8],
            ].map(([k, v]) => (
              <li key={k as string}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{k}</span>
                  <span className="text-muted-foreground">{v}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-saffron-gradient"
                    style={{ width: `${v}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  ),
});
