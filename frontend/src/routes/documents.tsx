import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents · NagarSeva" }] }),
  component: () => (
    <Card className="p-6 md:p-8">
      <h2 className="font-display text-2xl font-semibold text-primary">
        My document vault
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Synced with DigiLocker · 12 documents
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {[
          "Aadhaar Card",
          "PAN Card",
          "Voter ID",
          "Ration Card",
          "Birth Certificate — Aanya",
          "Marriage Certificate",
          "Property Tax Receipt FY24-25 Q3",
          "Water Bill · Dec 2024",
          "Driving License",
          "Vehicle RC — GJ01AB 4821",
          "Trade License",
          "Rebate Certificate",
        ].map((d) => (
          <div
            key={d}
            className="flex items-center justify-between rounded-xl border border-border p-4"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">{d}</span>
            </div>
            <Button size="sm" variant="ghost">
              <Download className="h-3.5 w-3.5 mr-1" />
              PDF
            </Button>
          </div>
        ))}
      </div>
    </Card>
  ),
});
