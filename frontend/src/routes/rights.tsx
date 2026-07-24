import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import {
  Scale,
  Vote,
  ShieldCheck,
  Users,
  BookOpen,
  Accessibility,
} from "lucide-react";

export const Route = createFileRoute("/rights")({
  head: () => ({
    meta: [
      { title: "Citizen Rights · NagarSeva" },
      {
        name: "description",
        content:
          "Know your rights: RTI, consumer protection, women's safety, disability rights and citizen charters.",
      },
      { property: "og:url", content: "/rights" },
    ],
    links: [{ rel: "canonical", href: "/rights" }],
  }),
  component: RightsPage,
});

const rights = [
  {
    icon: Scale,
    t: "Right to Information",
    d: "Access government records and decisions under the RTI Act, 2005.",
  },
  {
    icon: ShieldCheck,
    t: "Consumer Rights",
    d: "Redressal for defective goods, services and unfair trade practices.",
  },
  {
    icon: Users,
    t: "Women's Safety",
    d: "Helplines, one-stop centres and legal aid under Nirbhaya framework.",
  },
  {
    icon: Accessibility,
    t: "Rights of Persons with Disabilities",
    d: "Access to services, education and accommodations under RPWD 2016.",
  },
  {
    icon: Vote,
    t: "Right to Vote",
    d: "Enrol, verify and cast your vote in municipal, state and national elections.",
  },
  {
    icon: BookOpen,
    t: "Right to Education",
    d: "Free and compulsory education for children aged 6–14 under RTE Act.",
  },
];

function RightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Citizen Rights"
        title="Know what's yours. Claim it with confidence."
        intro="Concise, plain-language explainers of the rights every Indian citizen enjoys."
      />
      <Section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rights.map((r) => (
            <Card key={r.t} className="p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-primary">
                {r.t}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.d}</p>
              <button className="mt-3 text-sm font-medium text-accent">
                Read guide →
              </button>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
