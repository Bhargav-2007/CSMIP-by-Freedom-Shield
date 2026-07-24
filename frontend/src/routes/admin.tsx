import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  Workflow,
  LayoutList,
  Building2,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Console · NagarSeva" }] }),
  component: AdminHome,
});

const modules = [
  {
    icon: Users,
    t: "Users",
    d: "Citizens, officers, admins",
    to: "/admin/users",
  },
  {
    icon: Shield,
    t: "Roles & permissions",
    d: "RBAC, scopes, audit",
    to: "/admin/roles",
  },
  {
    icon: Workflow,
    t: "Workflows",
    d: "Design & publish",
    to: "/admin/workflows",
  },
  {
    icon: LayoutList,
    t: "Service catalog",
    d: "1,240 live services",
    to: "/admin/services",
  },
  {
    icon: Building2,
    t: "Departments",
    d: "48 mapped to wards",
    to: "/admin/departments",
  },
  { icon: FileText, t: "CMS", d: "Notices, pages, banners", to: "/admin/cms" },
  {
    icon: BarChart3,
    t: "Analytics",
    d: "Realtime + historical",
    to: "/admin/analytics",
  },
  {
    icon: Settings,
    t: "Settings",
    d: "Tenant, SLA, branding",
    to: "/admin/settings",
  },
];

function AdminHome() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-primary">
            Admin Console
          </h1>
          <p className="text-sm text-muted-foreground">
            Ahmedabad Municipal Corporation · Super Admin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Switch tenant</Button>
          <Button className="bg-primary hover:bg-primary/90">
            New service
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        {[
          ["412", "ULBs"],
          ["2.8Cr", "Citizens"],
          ["1,240", "Services"],
          ["94%", "SLA"],
        ].map(([v, l]) => (
          <Card key={l} className="p-5">
            <div className="font-display text-3xl font-semibold text-primary">
              {v}
            </div>
            <div className="text-xs text-muted-foreground">{l}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((m) => (
          <Link key={m.t} to={m.to}>
            <Card className="p-6 h-full transition hover:-translate-y-0.5 hover:shadow-elevated">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <m.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-primary">
                {m.t}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.d}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
