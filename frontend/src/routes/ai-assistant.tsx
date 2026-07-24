import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Mic, Paperclip } from "lucide-react";
import aiImg from "@/assets/ai-assistant.jpg";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "Seva AI Assistant · NagarSeva" },
      {
        name: "description",
        content:
          "Chat with Seva AI to discover services, fill forms, draft RTIs and check scheme eligibility.",
      },
      { property: "og:url", content: "/ai-assistant" },
    ],
    links: [{ rel: "canonical", href: "/ai-assistant" }],
  }),
  component: AiPage,
});

const chat = [
  {
    role: "ai",
    text: "Namaste! I'm Seva AI. What would you like to do today — pay a bill, apply for a certificate, or file a complaint?",
  },
  { role: "me", text: "Property tax is due. Can you help me pay it?" },
  {
    role: "ai",
    text: "Sure. Your Property ID PT/AMC/48-291-337 shows ₹12,480 due on 31 Mar. Would you like to pay via UPI? Applying rebate could save you ~₹1,200.",
  },
];

const suggestions = [
  "Apply for birth certificate",
  "Draft an RTI on road repair",
  "Check Ayushman eligibility",
  "Book community hall",
];

function AiPage() {
  return (
    <>
      <PageHero
        eyebrow="Seva AI"
        title="An assistant that speaks your language — literally."
        intro="Chat, voice or upload — Seva AI navigates every municipal process for you."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="flex flex-col overflow-hidden">
            <div className="border-b border-border bg-secondary/40 px-5 py-3 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-saffron-gradient text-white text-sm font-bold">
                S
              </div>
              <div>
                <div className="font-medium text-sm">Seva AI</div>
                <div className="text-xs text-muted-foreground">
                  Online · English
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-4 p-6 min-h-[420px]">
              {chat.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "me" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-3">
              <div className="mb-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs hover:border-accent hover:bg-accent/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-secondary/60 p-1.5">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Ask anything about municipal services…"
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
                <Button variant="ghost" size="icon">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button size="icon" className="bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <img
                src={aiImg}
                width={1024}
                height={1024}
                loading="lazy"
                alt=""
                className="h-40 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-accent">
                  <Sparkles className="h-4 w-4" /> Modules
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {[
                    "Citizen Assistant",
                    "Form Filling Agent",
                    "Document Intelligence",
                    "Semantic Search",
                    "Complaint Resolution",
                    "Workflow Agent",
                  ].map((m) => (
                    <li
                      key={m}
                      className="rounded-lg bg-secondary/60 px-3 py-2"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
