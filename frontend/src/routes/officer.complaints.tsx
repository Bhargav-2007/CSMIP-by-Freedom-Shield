import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/officer/complaints")({
  head: () => ({ meta: [{ title: "Complaints Queue · Officer · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10 grid gap-6 lg:grid-cols-4">
      {["New", "In progress", "Escalated", "Closed"].map((col, ci) => (
        <div key={col}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display font-semibold text-primary">{col}</h3>
            <Badge variant="secondary">{[6, 12, 3, 41][ci]}</Badge>
          </div>
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Card key={i} className="p-4 text-sm">
                <div className="text-xs text-muted-foreground">
                  CMP-8{ci}
                  {i}0{i}
                </div>
                <div className="mt-1 font-medium">
                  {
                    [
                      "Garbage overflow",
                      "Streetlight out",
                      "Water leak",
                      "Pothole",
                    ][(ci + i) % 4]
                  }
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Ward {4 + i} · SLA {24 - i * 6}h
                </div>
                <Button size="sm" variant="ghost" className="mt-2 h-7 px-2">
                  View →
                </Button>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
});
