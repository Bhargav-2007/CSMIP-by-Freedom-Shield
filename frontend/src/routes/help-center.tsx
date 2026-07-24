import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, HelpCircle, Mail, Phone, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/help-center")({
  head: () => ({
    meta: [
      { title: "Help Center · NagarSeva" },
      {
        name: "description",
        content:
          "FAQs, live chat, phone and email support for citizens and officers.",
      },
      { property: "og:url", content: "/help-center" },
    ],
    links: [{ rel: "canonical", href: "/help-center" }],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "How do I check property tax dues without logging in?",
    a: "Use Quick Pay on the Payments page and enter your Property ID.",
  },
  {
    q: "What documents do I need for a birth certificate?",
    a: "Proof of birth (hospital record), parents' Aadhaar and address proof.",
  },
  {
    q: "How long does complaint escalation take?",
    a: "SLA depends on category — most utility complaints escalate after 24 hours.",
  },
  {
    q: "Which languages does Seva AI support?",
    a: "22 official Indian languages, plus English.",
  },
  {
    q: "Can I file RTI in Hindi?",
    a: "Yes, choose Hindi in the language selector while drafting.",
  },
  {
    q: "Is my data safe?",
    a: "The platform is ISO 27001 certified and follows MeitY security guidelines.",
  },
];

function HelpPage() {
  return (
    <>
      <PageHero
        eyebrow="Help"
        title="We're here whenever you need us."
        intro="Search the knowledge base, chat with Seva AI, or reach a human at your ULB."
      >
        <div className="mt-4 flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles…"
              className="pl-10 h-11 bg-background"
            />
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Search
          </Button>
        </div>
      </PageHero>
      <Section>
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          {[
            {
              icon: MessageSquare,
              t: "Chat with Seva AI",
              d: "Instant answers, 24×7.",
            },
            { icon: Phone, t: "Call your ULB", d: "155303 · Mon–Sat, 8am–8pm" },
            { icon: Mail, t: "Email support", d: "help@nagarseva.example" },
          ].map((c) => (
            <Card key={c.t} className="p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-primary">
                {c.t}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
            </Card>
          ))}
        </div>
        <h2 className="font-display text-2xl font-semibold text-primary mb-4">
          Frequently asked
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {faqs.map((f) => (
            <Card key={f.q} className="p-5">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-primary">{f.q}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
