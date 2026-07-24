import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/workflows")({
  head: () => ({ meta: [{ title: "Workflow Builder · Admin · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-primary">
          Workflow Builder
        </h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" />
          New workflow
        </Button>
      </div>
      <Card className="p-6">
        <div className="flex items-center gap-2 text-accent">
          <GitBranch className="h-4 w-4" />
          <h3 className="font-display font-semibold text-primary">
            Birth Certificate · v3
          </h3>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {[
            "Applicant submits",
            "Verifier reviews docs",
            "Registrar approves",
            "System generates PDF",
            "DigiLocker sync",
            "Citizen notified",
          ].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-3">
              <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm">
                <div className="text-xs text-muted-foreground">
                  Step {i + 1}
                </div>
                <div className="font-medium">{s}</div>
              </div>
              {i < arr.length - 1 && <span className="text-accent">→</span>}
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3 text-sm">
          {[
            ["SLA", "7 days"],
            ["Auto-escalation", "After 5 days"],
            ["Fee", "₹50"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-secondary/60 p-3">
              <div className="text-xs text-muted-foreground">{k}</div>
              <div className="font-medium">{v}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  ),
});
