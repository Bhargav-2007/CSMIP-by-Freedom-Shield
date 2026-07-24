import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export const Route = createFileRoute("/properties")({
  head: () => ({ meta: [{ title: "Properties · NagarSeva" }] }),
  component: () => (
    <div className="space-y-4">
      {[
        {
          name: "3-BHK, Navrangpura",
          id: "PT/AMC/48-291-337",
          area: "1,240 sqft",
          tax: "₹12,480 due",
        },
        {
          name: "Shop, C.G. Road",
          id: "PT/AMC/48-291-812",
          area: "320 sqft",
          tax: "Paid FY24-25",
        },
      ].map((p) => (
        <Card key={p.id} className="p-6 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary/10 text-primary">
            <Home className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="font-display font-semibold text-primary">
              {p.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {p.id} · {p.area}
            </div>
          </div>
          <div className="text-sm text-right">
            <div>{p.tax}</div>
            <Button size="sm" variant="outline" className="mt-2">
              View
            </Button>
          </div>
        </Card>
      ))}
    </div>
  ),
});
