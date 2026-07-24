import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const roles = [
  {
    name: "Citizen",
    scopes: ["View own data", "Apply services", "Pay bills", "File complaints"],
  },
  {
    name: "Ward Officer",
    scopes: [
      "Read ward-scoped complaints",
      "Approve L1 applications",
      "Assign field tasks",
    ],
  },
  {
    name: "Zonal Officer",
    scopes: [
      "All Ward Officer scopes",
      "Approve L2 applications",
      "Escalate SLAs",
    ],
  },
  {
    name: "Deputy Commissioner",
    scopes: ["Read all zones", "Approve L3 applications", "Waivers"],
  },
  {
    name: "Admin",
    scopes: ["Manage users", "Configure services", "Publish CMS"],
  },
  {
    name: "Super Admin",
    scopes: ["All Admin scopes", "Tenant settings", "Audit log access"],
  },
];

export const Route = createFileRoute("/admin/roles")({
  head: () => ({ meta: [{ title: "Roles · Admin · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-primary mb-6">
        Roles & permissions
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((r) => (
          <Card key={r.name} className="p-5">
            <h3 className="font-display font-semibold text-primary">
              {r.name}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {r.scopes.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  ),
});
