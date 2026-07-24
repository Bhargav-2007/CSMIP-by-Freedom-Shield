import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/officer/reports")({
  head: () => ({ meta: [{ title: "Reports · Officer · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-primary mb-6">
        Department reports
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display font-semibold text-primary">
            Monthly SLA compliance
          </h3>
          <div className="mt-4 flex items-end gap-2 h-40">
            {[62, 74, 71, 82, 88, 91, 87, 92, 94, 89, 95, 92].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-saffron-gradient"
                style={{ height: `${v}%` }}
                title={`${v}%`}
              />
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Trailing 12 months
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-display font-semibold text-primary">
            Complaint category mix
          </h3>
          <ul className="mt-4 space-y-3">
            {[
              ["Sanitation", 34],
              ["Roads", 22],
              ["Water", 18],
              ["Streetlights", 14],
              ["Others", 12],
            ].map(([k, v]) => (
              <li key={k as string}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{k}</span>
                  <span className="text-muted-foreground">{v}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
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
