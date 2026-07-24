import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const rows = [
  ["T-9021", "Review trade license #TL-A/00214", "High", "Today, 5pm"],
  ["T-9020", "Inspect drainage complaint Zone 4-B", "High", "Today, 3pm"],
  ["T-8998", "Approve marriage certificate APP-23988", "Medium", "Tomorrow"],
  ["T-8974", "Verify Ayushman scheme eligibility (7)", "Low", "This week"],
  ["T-8940", "Publish tender for road repair — RFP-102", "Medium", "18 Apr"],
];

export const Route = createFileRoute("/officer/tasks")({
  head: () => ({ meta: [{ title: "Tasks · Officer · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-primary mb-6">
        My tasks
      </h1>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Task</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Due</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(([id, t, p, d]) => (
              <tr key={id}>
                <td className="px-5 py-3 font-medium">{id}</td>
                <td className="px-5 py-3">{t}</td>
                <td className="px-5 py-3">
                  <Badge variant={p === "High" ? "destructive" : "secondary"}>
                    {p}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{d}</td>
                <td className="px-5 py-3 text-right">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  ),
});
