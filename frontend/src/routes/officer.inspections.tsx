import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/officer/inspections")({
  head: () => ({ meta: [{ title: "Field Inspections · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-primary mb-6">
        Field inspections
      </h1>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Fire safety — Sky Tower", "17 Apr, 11am", "Scheduled"],
          ["Encroachment — Panchvati Lane", "17 Apr, 3pm", "Scheduled"],
          ["Building plan verification", "18 Apr, 10am", "Confirmed"],
          ["Water quality — Zone 4 tank", "19 Apr, 8am", "Pending"],
        ].map(([t, w, s]) => (
          <Card key={t} className="p-5 flex items-center gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{t}</div>
              <div className="text-xs text-muted-foreground">{w}</div>
            </div>
            <Badge variant="secondary">{s}</Badge>
          </Card>
        ))}
      </div>
    </div>
  ),
});
