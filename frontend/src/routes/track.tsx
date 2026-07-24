import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/site/Timeline";
import { Download, FileSpreadsheet, Search, FileText } from "lucide-react";
import { useApplications, type ServiceApplication } from "@/lib/store";
import { exportApplicationsToExcel } from "@/lib/exports";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Applications · CivicHub" },
      {
        name: "description",
        content:
          "Track every civic service application with a live process timeline.",
      },
    ],
    links: [{ rel: "canonical", href: "/track" }],
  }),
  component: TrackPage,
});

function TrackPage() {
  const { data: apps = [] } = useApplications();
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const filtered = apps.filter(
    (a) =>
      !q ||
      a.id.toLowerCase().includes(q.toLowerCase()) ||
      a.service.toLowerCase().includes(q.toLowerCase()),
  );
  const selected = filtered.find((a) => a.id === active) ?? filtered[0];

  return (
    <>
      <PageHero
        eyebrow="Track"
        title="Every application, one live timeline."
        intro="Watch your civic service applications move through submission, verification, approval and issuance."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => exportApplicationsToExcel(apps)}
            disabled={!apps.length}
          >
            <FileSpreadsheet className="h-4 w-4" /> Export all to Excel
          </Button>
        </div>
      </PageHero>

      <Section>
        {apps.length === 0 ? (
          <Card className="p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-3 font-display text-lg font-semibold text-primary">
              No applications yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Submit a form from Certificates, Complaints, Payments, Schemes,
              Licenses or Bookings — it will appear here in real time.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <div>
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by ID or service…"
                  className="pl-9"
                />
              </div>
              <div className="grid gap-2">
                {filtered.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setActive(a.id)}
                    className={`rounded-xl border p-4 text-left transition ${
                      selected?.id === a.id
                        ? "border-accent bg-accent/5 ring-1 ring-accent"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-xs text-muted-foreground">
                        {a.id}
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {a.status}
                      </Badge>
                    </div>
                    <div className="mt-1 font-medium">{a.service}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(a.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selected && (
              <Card className="p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      {selected.category}
                    </div>
                    <h2 className="font-display text-2xl font-semibold text-primary">
                      {selected.service}
                    </h2>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Tracking ID{" "}
                      <span className="font-mono text-primary">
                        {selected.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        exportApplicationsToExcel(
                          [selected],
                          `${selected.id}.xlsx`,
                        )
                      }
                    >
                      <Download className="mr-1 h-3.5 w-3.5" /> Download details
                    </Button>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Process timeline
                    </h3>
                    <Timeline steps={selected.timeline} />
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Submitted details
                    </h3>
                    <div className="rounded-xl border border-border">
                      <dl className="divide-y divide-border text-sm">
                        {Object.entries(selected.fields).map(([k, v]) => (
                          <div
                            key={k}
                            className="grid grid-cols-[140px_1fr] gap-3 px-4 py-2"
                          >
                            <dt className="capitalize text-muted-foreground">
                              {k}
                            </dt>
                            <dd className="min-w-0 break-words">{v || "—"}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    {selected.attachments.length > 0 && (
                      <div className="mt-4">
                        <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                          Attachments
                        </h3>
                        <ul className="grid gap-2">
                          {selected.attachments.map((f) => (
                            <li
                              key={f.name}
                              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                            >
                              <FileText className="h-4 w-4 text-accent" />
                              <span className="min-w-0 flex-1 truncate">
                                {f.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {Math.round(f.size / 1024)} KB
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </Section>
    </>
  );
}
