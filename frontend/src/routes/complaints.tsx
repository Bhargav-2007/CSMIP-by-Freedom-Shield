import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceForm } from "@/components/site/ServiceForm";
import { useComplaints } from "@/lib/store";

export const Route = createFileRoute("/complaints")({
  head: () => ({
    meta: [
      { title: "Citizen Complaints · CivicHub" },
      {
        name: "description",
        content:
          "File civic grievances with photos, video and PDF attachments. Track escalation and SLA.",
      },
      { property: "og:url", content: "/complaints" },
    ],
    links: [{ rel: "canonical", href: "/complaints" }],
  }),
  component: ComplaintsPage,
});

const categories = [
  "Roads",
  "Streetlights",
  "Water",
  "Drainage",
  "Sanitation",
  "Parks",
  "Encroachment",
  "Stray Animals",
  "Public Health",
  "Noise",
];
const wards = [
  "Ward 4 · Navrangpura",
  "Ward 12 · Maninagar",
  "Ward 27 · Chandkheda",
  "Ward 33 · Bopal",
  "Ward 41 · Vastrapur",
];

function ComplaintsPage() {
  const { data: complaints = [] } = useComplaints();
  const latestComplaint = complaints[0];

  return (
    <>
      <PageHero
        eyebrow="Grievance Redressal"
        title="Report an issue. Track it. Escalate it — automatically."
        intro="Every complaint is pinned to a ward, assigned an SLA, and escalated to a senior officer if it isn't resolved in time."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ServiceForm
              service="File a Complaint"
              category="complaint"
              idPrefix="CMP"
              requiredDocs={[
                "Photo of issue (JPG)",
                "Optional supporting doc (PDF)",
              ]}
              fields={[
                {
                  name: "category",
                  label: "Category",
                  type: "select",
                  required: true,
                  options: categories,
                },
                {
                  name: "ward",
                  label: "Ward",
                  type: "select",
                  required: true,
                  options: wards,
                },
                {
                  name: "location",
                  label: "Street / landmark",
                  required: true,
                  col: 2,
                },
                {
                  name: "title",
                  label: "Short title",
                  required: true,
                  col: 2,
                  placeholder: "e.g. Large pothole near school gate",
                },
                {
                  name: "description",
                  label: "Describe the issue",
                  type: "textarea",
                  required: true,
                  placeholder: "What happened? When did you notice it?",
                },
                {
                  name: "reporterMobile",
                  label: "Your mobile",
                  type: "tel",
                  required: true,
                },
                { name: "reporterEmail", label: "Your email", type: "email" },
              ]}
              intro="Attach photos or a PDF site report. Ward Officer SLA: 48 hrs, then auto-escalation."
            />
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Sample tracking
                  </div>
                  <div className="font-display text-lg font-semibold text-primary">
                    {latestComplaint
                      ? latestComplaint.complaint_number
                      : "No live complaints yet"}
                  </div>
                </div>
                <Badge
                  className={
                    latestComplaint
                      ? complaintTone(latestComplaint.status)
                      : "bg-secondary text-primary"
                  }
                >
                  {latestComplaint ? latestComplaint.status : "Sync pending"}
                </Badge>
              </div>
              {latestComplaint ? (
                <div className="mt-6 space-y-4 text-sm">
                  <div className="rounded-xl bg-secondary/60 px-4 py-3">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Latest complaint
                    </div>
                    <div className="mt-1 font-medium text-primary">
                      {latestComplaint.title}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {latestComplaint.category} ·{" "}
                      {latestComplaint.ward_name || latestComplaint.location}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <span className="text-muted-foreground">Escalations</span>
                      <span className="font-medium">
                        {latestComplaint.escalation_count}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <span className="text-muted-foreground">
                        SLA deadline
                      </span>
                      <span className="font-medium">
                        {latestComplaint.sla_deadline
                          ? new Date(
                              latestComplaint.sla_deadline,
                            ).toLocaleString("en-IN")
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <span className="text-muted-foreground">Overdue</span>
                      <span className="font-medium">
                        {latestComplaint.is_overdue ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Complaint records from the backend will appear here once
                  citizens start filing grievances.
                </p>
              )}
            </Card>
            <Card className="p-6 bg-primary text-primary-foreground">
              <h3 className="font-display text-lg font-semibold">
                Escalation matrix
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  ["0–24h", "Ward Officer"],
                  ["24–72h", "Zonal Officer"],
                  ["72h+", "Deputy Commissioner"],
                ].map(([w, r]) => (
                  <li
                    key={w}
                    className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                  >
                    <span className="opacity-70">{w}</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}

function complaintTone(status: string) {
  const value = status.toLowerCase();
  if (value === "resolved" || value === "closed") {
    return "bg-emerald/15 text-emerald";
  }

  if (value === "rejected") {
    return "bg-danger/15 text-danger";
  }

  return "bg-accent text-primary";
}
