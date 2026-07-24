import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import mapImg from "@/assets/gis-map.jpg";
import phoneImg from "@/assets/citizen-services.jpg";
import aiImg from "@/assets/ai-assistant.jpg";
import heroImg from "@/assets/hero-city.jpg";
import { Search } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources · NagarSeva" },
      {
        name: "description",
        content:
          "Blogs, guides, case studies and webinars on Indian urban governance and civic technology.",
      },
      { property: "og:url", content: "/resources" },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: ResourcesPage,
});

const filters = ["All", "Blog", "Guide", "Case Study", "Webinar", "Report"];
const posts = [
  {
    tag: "Case Study",
    title: "Surat Municipal Corporation cleared 82% grievances within SLA",
    read: "6 min",
    cover: mapImg,
    author: "SMC Team",
  },
  {
    tag: "Guide",
    title: "The field officer's handbook for property-tax collection",
    read: "9 min",
    cover: phoneImg,
    author: "Revenue Wing",
  },
  {
    tag: "Blog",
    title: "Voice-first governance for low-literacy citizens",
    read: "5 min",
    cover: aiImg,
    author: "Product Team",
  },
  {
    tag: "Report",
    title: "State of Indian ULB digital maturity, 2024",
    read: "24 min",
    cover: heroImg,
    author: "Policy Lab",
  },
  {
    tag: "Webinar",
    title: "Ward-level GIS: from data to decisions in 90 days",
    read: "45 min",
    cover: mapImg,
    author: "GIS Council",
  },
  {
    tag: "Guide",
    title: "RTI filing patterns and how ULBs can respond faster",
    read: "11 min",
    cover: aiImg,
    author: "Legal Wing",
  },
  {
    tag: "Case Study",
    title: "Ahmedabad's zero-touch trade license renewal experiment",
    read: "8 min",
    cover: phoneImg,
    author: "AMC Team",
  },
  {
    tag: "Blog",
    title: "Designing forms for citizens who share phones",
    read: "7 min",
    cover: heroImg,
    author: "Design Team",
  },
  {
    tag: "Report",
    title: "Sanitation worker welfare: outcomes across 40 ULBs",
    read: "18 min",
    cover: mapImg,
    author: "Policy Lab",
  },
];

function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Insights, playbooks and stories from India's urban governance."
        intro="Read what ULBs, officers and civic technologists are learning as they modernise service delivery."
      >
        <div className="mt-4 flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles, guides & case studies…"
              className="pl-10 h-11 bg-background"
            />
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Search
          </Button>
        </div>
      </PageHero>

      <Section>
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((f, i) => (
            <button
              key={f}
              className={`rounded-full border px-4 py-1.5 text-sm ${i === 0 ? "border-accent bg-accent text-primary" : "border-border hover:border-accent/50"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Card
              key={p.title}
              className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <img
                src={p.cover}
                width={1024}
                height={1024}
                loading="lazy"
                alt=""
                className="h-44 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary">{p.tag}</Badge>
                  <span className="text-muted-foreground">{p.read} read</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-primary line-clamp-2">
                  {p.title}
                </h3>
                <div className="mt-3 text-xs text-muted-foreground">
                  By {p.author}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
