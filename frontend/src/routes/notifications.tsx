import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  AlertTriangle,
  Droplets,
  Calendar,
  Megaphone,
} from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Public Notices · NagarSeva" },
      {
        name: "description",
        content:
          "Latest announcements, notices and alerts from your Urban Local Body.",
      },
      { property: "og:url", content: "/notifications" },
    ],
    links: [{ rel: "canonical", href: "/notifications" }],
  }),
  component: NotificationsPage,
});

const items = [
  {
    icon: Droplets,
    tag: "Utility",
    title: "Water supply maintenance in Wards 12–17",
    body: "Scheduled from 6am–10am on Sunday, 14 April.",
    when: "2 hours ago",
    urgent: true,
  },
  {
    icon: Calendar,
    tag: "Rebate",
    title: "Property tax rebate window extended",
    body: "Pay full-year property tax by 30 April to claim up to 10% rebate.",
    when: "1 day ago",
  },
  {
    icon: Megaphone,
    tag: "Enrolment",
    title: "New Anganwadi enrolment drive",
    body: "82 zones across the city now open for enrolment. Documents required: Aadhaar & residence proof.",
    when: "2 days ago",
  },
  {
    icon: AlertTriangle,
    tag: "Alert",
    title: "Air quality advisory",
    body: "AQI in central wards exceeded 220. Sensitive groups advised to stay indoors between 4pm–8pm.",
    when: "3 days ago",
    urgent: true,
  },
  {
    icon: Bell,
    tag: "Event",
    title: "Public consultation on new Master Plan",
    body: "Open house at Town Hall, 22 April, 4pm. Register online.",
    when: "4 days ago",
  },
];

function NotificationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Public Notices"
        title="Stay informed. Nothing slips through the cracks."
        intro="Push, email and SMS alerts for anything that affects your ward."
      />
      <Section>
        <div className="grid gap-3">
          {items.map((n) => (
            <Card
              key={n.title}
              className={`p-5 flex gap-4 ${n.urgent ? "border-danger/40 bg-danger/5" : ""}`}
            >
              <div
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${n.urgent ? "bg-danger/15 text-danger" : "bg-accent/15 text-accent"}`}
              >
                <n.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[10px]">
                    {n.tag}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {n.when}
                  </span>
                </div>
                <h3 className="mt-1 font-display font-semibold text-primary">
                  {n.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
