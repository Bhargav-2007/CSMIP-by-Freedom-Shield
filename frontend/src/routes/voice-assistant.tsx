import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

export const Route = createFileRoute("/voice-assistant")({
  head: () => ({
    meta: [
      { title: "Voice Assistant · NagarSeva" },
      {
        name: "description",
        content:
          "Speak to your city. Voice-first governance for low-literacy citizens in 22 Indian languages.",
      },
      { property: "og:url", content: "/voice-assistant" },
    ],
    links: [{ rel: "canonical", href: "/voice-assistant" }],
  }),
  component: VoicePage,
});

function VoicePage() {
  return (
    <>
      <PageHero
        eyebrow="Voice Mode"
        title="Speak to your city."
        intro="Ask, apply and pay — hands-free — in your language."
      />
      <Section>
        <Card className="p-12 md:p-16 text-center bg-hero-gradient text-white">
          <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-white/10 backdrop-blur">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-saffron-gradient shadow-elevated">
              <Mic className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mt-8 font-display text-3xl font-semibold">
            Tap to speak
          </h2>
          <p className="mt-2 text-white/80">
            Try: "Mera paani ka bill kitna hai?" or "Birth certificate kaise
            banega?"
          </p>
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            {["हिन्दी", "ગુજરાતી", "मराठी", "தமிழ்", "తెలుగు", "বাংলা"].map(
              (l) => (
                <button
                  key={l}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm"
                >
                  {l}
                </button>
              ),
            )}
          </div>
        </Card>
      </Section>
    </>
  );
}
