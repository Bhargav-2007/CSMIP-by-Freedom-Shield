import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/family")({
  head: () => ({ meta: [{ title: "Family · NagarSeva" }] }),
  component: () => (
    <Card className="p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-primary">
          Family members
        </h2>
        <Button className="bg-primary hover:bg-primary/90">Add member</Button>
      </div>
      <div className="mt-6 grid gap-3">
        {[
          ["Sunita Mehta", "Spouse", "Aadhaar linked"],
          ["Aanya Mehta", "Daughter, 7 y", "Birth cert · School linked"],
          ["Arjun Mehta", "Son, 12 y", "Birth cert · School linked"],
          ["Kailashben Mehta", "Mother, 68 y", "Senior card · Pension"],
        ].map(([n, r, s]) => (
          <div
            key={n}
            className="flex items-center justify-between rounded-xl border border-border p-4"
          >
            <div>
              <div className="font-medium">{n}</div>
              <div className="text-xs text-muted-foreground">{r}</div>
            </div>
            <Badge variant="secondary">{s}</Badge>
          </div>
        ))}
      </div>
    </Card>
  ),
});
