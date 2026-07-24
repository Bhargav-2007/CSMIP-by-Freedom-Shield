import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import {
  MessagesSquare,
  Receipt,
  FileCheck2,
  AlertOctagon,
  HandHeart,
  MapPinned,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/ai/")({
  head: () => ({
    meta: [
      { title: "AI Assistants · CivicHub" },
      {
        name: "description",
        content: "Purpose-built AI assistants for every civic module.",
      },
    ],
    links: [{ rel: "canonical", href: "/ai" }],
  }),
  component: AIHub,
});

const bots = [
  {
    to: "/ai/complaints",
    name: "Grievance Bot",
    icon: AlertOctagon,
    desc: "Draft complaints, find the right ward officer, check SLAs and escalate.",
  },
  {
    to: "/ai/payments",
    name: "Payments Bot",
    icon: Receipt,
    desc: "Explain bills, compute rebates, guide you through UPI payment.",
  },
  {
    to: "/ai/certificates",
    name: "Certificate Bot",
    icon: FileCheck2,
    desc: "Choose the right certificate, list documents, track issuance.",
  },
  {
    to: "/ai/schemes",
    name: "Schemes Bot",
    icon: HandHeart,
    desc: "Check eligibility for Central, State and Municipal welfare schemes.",
  },
  {
    to: "/ai/maps",
    name: "City Maps Bot",
    icon: MapPinned,
    desc: "Find nearest offices, ward boundaries, project locations.",
  },
  {
    to: "/ai/general",
    name: "Seva Assistant",
    icon: MessagesSquare,
    desc: "General questions, language help, quick guidance.",
  },
];

function AIHub() {
  return (
    <>
      <PageHero
        eyebrow="AI Assistants"
        title="A specialist chatbot for every civic module."
        intro="Each bot is trained for its domain — no generic answers. Ask in your language."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bots.map((b) => (
            <Link key={b.to} to={b.to} className="group">
              <Card className="h-full p-6 transition hover:-translate-y-0.5 hover:shadow-elevated">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-saffron-gradient text-white">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-primary">
                  {b.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm text-accent">
                  Open chat{" "}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
