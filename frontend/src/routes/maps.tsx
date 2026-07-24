import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import mapImg from "@/assets/gis-map.jpg";
import { Layers, MapPin } from "lucide-react";

export const Route = createFileRoute("/maps")({
  head: () => ({
    meta: [
      { title: "GIS & Ward Maps · NagarSeva" },
      {
        name: "description",
        content:
          "Explore ward boundaries, complaint heatmaps, property records and civic infrastructure on an interactive map.",
      },
      { property: "og:url", content: "/maps" },
    ],
    links: [{ rel: "canonical", href: "/maps" }],
  }),
  component: MapsPage,
});

const layers = [
  { name: "Ward boundaries", on: true },
  { name: "Complaint heatmap", on: true },
  { name: "Property parcels", on: false },
  { name: "Water network", on: false },
  { name: "Drainage lines", on: false },
  { name: "Streetlights", on: true },
  { name: "Public toilets", on: false },
  { name: "Waste routes", on: false },
];

function MapsPage() {
  return (
    <>
      <PageHero
        eyebrow="GIS"
        title="Governance, mapped down to your street."
        intro="Toggle layers, spot hotspots and drill into properties, works and complaints."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Card className="p-5 h-fit">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-accent" />
              <h3 className="font-display font-semibold text-primary">
                Layers
              </h3>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {layers.map((l) => (
                <label
                  key={l.name}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-secondary"
                >
                  <span>{l.name}</span>
                  <input
                    type="checkbox"
                    defaultChecked={l.on}
                    className="rounded"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-secondary/60 p-3 text-xs">
              <div className="font-semibold text-primary mb-2">Legend</div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-4 rounded bg-danger" /> High complaint
                density
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-4 rounded bg-warning" /> Medium
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-4 rounded bg-emerald" /> Low
              </div>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src={mapImg}
                width={1024}
                height={1024}
                alt="Interactive ward map"
                className="w-full"
              />
              <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-xs shadow-card">
                <MapPin className="inline h-3 w-3 text-accent mr-1" /> Ahmedabad
                Municipal Corporation · 48 wards
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button size="sm" variant="secondary">
                  Zoom in
                </Button>
                <Button size="sm" variant="secondary">
                  Zoom out
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
              {[
                ["48", "Wards"],
                ["1,240", "Complaints (30d)"],
                ["9.2M", "Property records"],
              ].map(([v, l]) => (
                <div key={l} className="p-5 text-center">
                  <div className="font-display text-2xl font-semibold text-primary">
                    {v}
                  </div>
                  <div className="text-xs text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
