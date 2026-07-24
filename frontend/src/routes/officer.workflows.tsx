import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workflow } from "lucide-react";

export const Route = createFileRoute("/officer/workflows")({
  head: () => ({ meta: [{ title: "Workflows · Officer · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-primary mb-2">
        Workflow templates
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Ready-made process templates for common ULB tasks.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          "Birth Certificate Issuance",
          "Trade License Renewal",
          "Property Tax Assessment",
          "Fire NOC Approval",
          "Grievance Resolution",
          "Building Plan Approval",
        ].map((w) => (
          <Card key={w} className="p-5">
            <Workflow className="h-5 w-5 text-accent" />
            <h3 className="mt-3 font-display font-semibold text-primary">
              {w}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              4–7 steps · SLA configured · Auto-escalation on
            </p>
            <Button size="sm" variant="outline" className="mt-4">
              Open flow
            </Button>
          </Card>
        ))}
      </div>
    </div>
  ),
});
