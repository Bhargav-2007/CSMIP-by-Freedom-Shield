import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  AlertTriangle,
  MapPin,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/officer/dashboard")({
  head: () => ({ meta: [{ title: "Officer Dashboard · NagarSeva" }] }),
  component: OfficerDashboard,
});

const officerNav = [
  { to: "/officer/dashboard", label: "Overview" },
  { to: "/officer/tasks", label: "Tasks" },
  { to: "/officer/complaints", label: "Complaints" },
  { to: "/officer/workflows", label: "Workflows" },
  { to: "/officer/inspections", label: "Inspections" },
  { to: "/officer/reports", label: "Reports" },
];

function OfficerDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-primary">
            Officer Console
          </h1>
          <p className="text-sm text-muted-foreground">
            Meena Patil · Ward Officer, Zone 4 · Navrangpura
          </p>
        </div>
        <nav className="hidden md:flex gap-1 rounded-full border border-border bg-secondary/40 p-1">
          {officerNav.map((n, i) => (
            <Link
              key={n.to}
              to={n.to}
              className={`rounded-full px-3 py-1.5 text-sm ${i === 0 ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { l: "Assigned tasks", v: "24", i: ClipboardList },
          { l: "Open complaints", v: "18", i: AlertTriangle },
          { l: "SLA compliance", v: "92%", i: CheckCircle2 },
          { l: "Field visits today", v: "6", i: MapPin },
        ].map((s) => (
          <Card key={s.l} className="p-5">
            <s.i className="h-5 w-5 text-accent" />
            <div className="mt-3 font-display text-2xl font-semibold text-primary">
              {s.v}
            </div>
            <div className="text-xs text-muted-foreground">{s.l}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-primary">
              Today's queue
            </h3>
            <Button size="sm" variant="outline">
              Filter
            </Button>
          </div>
          <div className="mt-4 divide-y divide-border">
            {[
              ["CMP-8421", "Garbage overflow · Ward 4", "SLA in 6h", "warn"],
              ["APP-24081", "Birth cert verification", "Docs uploaded", "ok"],
              ["INS-4102", "Fire safety inspection", "Site visit 4pm", "ok"],
              ["CMP-8398", "Streetlight — 3 units", "Escalated", "danger"],
              ["APP-24067", "Trade license renewal", "Approve pending", "warn"],
            ].map(([id, t, meta, tone]) => (
              <div key={id as string} className="py-3 flex items-center gap-3">
                <Badge
                  className={
                    tone === "danger"
                      ? "bg-danger/15 text-danger hover:bg-danger/15"
                      : tone === "warn"
                        ? "bg-warning/20 text-warning hover:bg-warning/20"
                        : "bg-emerald/15 text-emerald hover:bg-emerald/15"
                  }
                >
                  {id}
                </Badge>
                <div className="flex-1">
                  <div className="text-sm font-medium">{t}</div>
                  <div className="text-xs text-muted-foreground">{meta}</div>
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Action
                </Button>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 text-accent">
            <TrendingUp className="h-4 w-4" />
            <h3 className="font-display font-semibold text-primary">
              Ward pulse
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {[
              ["Sanitation", 72],
              ["Water", 88],
              ["Roads", 54],
              ["Streetlights", 91],
            ].map(([k, v]) => (
              <div key={k as string}>
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
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
