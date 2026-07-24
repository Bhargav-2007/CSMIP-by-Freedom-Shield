import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export const Route = createFileRoute("/admin/departments")({
  head: () => ({ meta: [{ title: "Departments · Admin · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-primary mb-6">
        Departments
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          ["Revenue", 42, "Property tax, licenses, marriage records"],
          ["Public Health", 28, "Birth/death, sanitation, hospitals"],
          ["Water Works", 34, "Supply, connections, quality"],
          ["Engineering", 51, "Roads, streetlights, drainage"],
          ["Town Planning", 22, "Approvals, encroachment, master plan"],
          ["Fire", 14, "NOCs, inspections, emergencies"],
          ["Solid Waste", 18, "Collection, recycling, routes"],
          ["Legal", 9, "RTI, litigation, contracts"],
        ].map(([n, staff, scope]) => (
          <Card key={n as string} className="p-5">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-display font-semibold text-primary">
              {n}
            </h3>
            <div className="text-xs text-muted-foreground">
              {staff} officers
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{scope}</p>
          </Card>
        ))}
      </div>
    </div>
  ),
});
