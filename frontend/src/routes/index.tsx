import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/site/Section";
import {
  Search,
  Mic,
  FileText,
  Receipt,
  AlertTriangle,
  Building2,
  MapPin,
  Sparkles,
  ShieldCheck,
  Wallet,
  Users,
  Phone,
  Bell,
  ArrowRight,
  Landmark,
  Droplets,
  GraduationCap,
  Heart,
  Briefcase,
  TreePine,
  Baby,
  Home,
} from "lucide-react";
import heroImg from "@/assets/hero-city.jpg";
import aiImg from "@/assets/ai-assistant.jpg";
import mapImg from "@/assets/gis-map.jpg";
import phoneImg from "@/assets/citizen-services.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NagarSeva — Digital Governance for Indian Cities" },
      {
        name: "description",
        content:
          "Discover services, pay bills, file complaints, and access certificates from your Urban Local Body — with AI guidance in your language.",
      },
      {
        property: "og:title",
        content: "NagarSeva — Digital Governance for Indian Cities",
      },
      {
        property: "og:description",
        content:
          "Unified citizen portal for Indian municipalities. Powered by AI.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const popular = [
  { icon: Receipt, label: "Property Tax", to: "/payments" },
  { icon: FileText, label: "Birth Certificate", to: "/certificates" },
  { icon: AlertTriangle, label: "File Complaint", to: "/complaints" },
  { icon: Droplets, label: "Water Bill", to: "/payments" },
  { icon: Briefcase, label: "Trade License", to: "/licenses" },
  { icon: Building2, label: "Building Permit", to: "/licenses" },
  { icon: Landmark, label: "Community Hall", to: "/bookings" },
  { icon: ShieldCheck, label: "RTI Request", to: "/rti" },
];

const categories = [
  {
    icon: FileText,
    title: "Certificates",
    desc: "Birth, death, marriage, income, caste & more",
    to: "/certificates",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Wallet,
    title: "Payments",
    desc: "Property tax, water, drainage, professional tax",
    to: "/payments",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: AlertTriangle,
    title: "Complaints",
    desc: "File, track & escalate civic grievances",
    to: "/complaints",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    icon: Briefcase,
    title: "Licenses",
    desc: "Trade, shop, vendor, contractor licenses",
    to: "/licenses",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Building2,
    title: "Building Permits",
    desc: "Plan approval, occupancy certificate",
    to: "/licenses",
    color: "bg-slate-500/10 text-slate-600",
  },
  {
    icon: Landmark,
    title: "Bookings",
    desc: "Halls, auditoriums, parks, sports facilities",
    to: "/bookings",
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    icon: ShieldCheck,
    title: "RTI",
    desc: "File RTI, appeals & track responses",
    to: "/rti",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Heart,
    title: "Schemes",
    desc: "Central, state & municipal schemes",
    to: "/schemes",
    color: "bg-rose-500/10 text-rose-600",
  },
];

const schemes = [
  {
    icon: Home,
    name: "PM Awas Yojana",
    tag: "Housing",
    desc: "Affordable housing for urban families.",
  },
  {
    icon: Baby,
    name: "ICDS Anganwadi",
    tag: "Child Welfare",
    desc: "Nutrition & early childhood care.",
  },
  {
    icon: GraduationCap,
    name: "PM Vidya Lakshmi",
    tag: "Education",
    desc: "Education loans for higher studies.",
  },
  {
    icon: Heart,
    name: "Ayushman Bharat",
    tag: "Health",
    desc: "Health cover of ₹5L per family per year.",
  },
];

const stats = [
  { v: "412", l: "ULBs onboarded" },
  { v: "2.8Cr+", l: "Citizens served" },
  { v: "1,240+", l: "Services digitised" },
  { v: "94%", l: "SLA compliance" },
];

const articles = [
  {
    tag: "Case Study",
    title: "How Surat cleared 82% of grievances within SLA",
    read: "6 min",
    cover: mapImg,
  },
  {
    tag: "Guide",
    title: "A field officer's playbook for property tax collection",
    read: "9 min",
    cover: phoneImg,
  },
  {
    tag: "Insight",
    title: "Voice-first governance for low-literacy citizens",
    read: "5 min",
    cover: aiImg,
  },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,.3), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.2), transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3 w-3 text-accent" />
              AI-powered citizen services · 22 Indian languages
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05]">
              Your city, <span className="text-accent">simplified.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Discover services, pay taxes, book facilities and file complaints
              across every Urban Local Body — from a single, accessible
              platform.
            </p>
            <div className="mt-8 rounded-2xl bg-white p-2 shadow-elevated">
              <div className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for a service, department or scheme…"
                  className="border-0 bg-transparent text-foreground focus-visible:ring-0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  Search
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 px-3 py-2 text-xs text-muted-foreground">
                <span className="opacity-70">Try:</span>
                {[
                  "Property tax",
                  "Birth certificate",
                  "Water complaint",
                  "Trade license",
                ].map((t) => (
                  <button
                    key={t}
                    className="rounded-full bg-secondary px-2.5 py-0.5 hover:bg-accent/20"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent" />{" "}
                DigiLocker-linked
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-accent" /> Aadhaar authenticated
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-accent" /> Ward-level accuracy
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-accent/20 blur-2xl" />
            <img
              src={heroImg}
              width={1024}
              height={1024}
              alt="Digital Indian city illustration"
              className="relative rounded-3xl border border-white/10 shadow-elevated"
            />
          </div>
        </div>
      </section>

      {/* MUNICIPALITY BAR */}
      <div className="border-b border-border/60 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent" />
            You are viewing services for{" "}
            <button className="font-medium text-primary underline underline-offset-2">
              Ahmedabad Municipal Corporation
            </button>
          </div>
          <div className="flex items-center gap-2 opacity-70">
            <span className="text-xs">Also live in:</span>
            {["Surat", "Vadodara", "Pune", "BBMP", "GHMC", "MCD"].map((c) => (
              <span
                key={c}
                className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* POPULAR SERVICES */}
      <Section
        eyebrow="Quick access"
        title="Most-used citizen services"
        intro="Skip the queues. Complete these top requests in minutes, right here."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {popular.map((p) => (
            <Link key={p.label} to={p.to} className="group">
              <Card className="h-full p-4 text-center transition hover:-translate-y-0.5 hover:border-accent hover:shadow-card">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-accent/15 text-accent group-hover:bg-accent group-hover:text-white transition">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="mt-2.5 text-xs font-medium leading-tight">
                  {p.label}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* CATEGORIES */}
      <Section
        eyebrow="Explore"
        title="Every service, one platform"
        intro="Categories mirror how ULBs are organised, so citizens and officers speak the same language."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.title} to={c.to}>
              <Card className="h-full p-6 transition hover:-translate-y-0.5 hover:shadow-elevated">
                <div
                  className={`inline-grid h-11 w-11 place-items-center rounded-xl ${c.color}`}
                >
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-primary">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent">
                  Browse <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* AI ASSISTANT BAND */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent-foreground/80">
              <Sparkles className="h-3 w-3 text-accent" /> Meet Seva AI
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-primary">
              A helpful assistant in your language, for every civic task.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Seva AI reads your documents, fills forms, drafts RTI applications
              and explains eligibility — through chat or voice, in 22 Indian
              languages.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Voice-first for low-literacy users",
                "Auto-fills forms from DigiLocker documents",
                "Explains fees, timelines and required papers",
                "Handoff to a real officer whenever you want",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <div className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent/20 text-accent">
                    ✓
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Link to="/ai-assistant">
                <Button className="bg-primary hover:bg-primary/90">
                  Try Seva AI
                </Button>
              </Link>
              <Link to="/voice-assistant">
                <Button variant="outline">Voice mode</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={aiImg}
              width={1024}
              height={1024}
              loading="lazy"
              alt="AI assistant illustration"
              className="rounded-3xl shadow-card"
            />
          </div>
        </div>
      </section>

      {/* SCHEMES */}
      <Section
        eyebrow="Schemes"
        title="Government benefits you may qualify for"
        intro="Seva AI checks your eligibility across Central, State and Municipal schemes in seconds."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {schemes.map((s) => (
            <Card key={s.name} className="p-5">
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-saffron-gradient text-white">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {s.tag}
                </span>
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-primary">
                {s.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              <Link
                to="/schemes"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent"
              >
                Check eligibility <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* GIS MAP */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 grid gap-10 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1">
            <img
              src={mapImg}
              width={1024}
              height={1024}
              loading="lazy"
              alt="Ward map preview"
              className="rounded-3xl border border-white/10 shadow-elevated"
            />
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs">
              GIS & Ward Maps
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold">
              Governance that knows your neighbourhood.
            </h2>
            <p className="mt-3 text-white/75">
              Every complaint, service, permit and inspection is pinned to a
              ward. Officers see workload by zone; citizens see progress on
              their street.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                "Ward-wise complaint heatmaps",
                "Property-level tax records",
                "Encroachment detection",
                "Waste collection routes",
              ].map((f) => (
                <div
                  key={f}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm"
                >
                  {f}
                </div>
              ))}
            </div>
            <Link to="/maps">
              <Button className="mt-6 bg-accent text-primary hover:bg-accent/90">
                Open ward map
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <Section>
        <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="font-display text-4xl font-semibold text-primary">
                  {s.v}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ANNOUNCEMENTS + EMERGENCY */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-accent" />
              <h3 className="font-display text-lg font-semibold text-primary">
                Latest announcements
              </h3>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {[
                {
                  d: "Mon",
                  t: "Water supply maintenance in Wards 12–17 on Sunday, 6am–10am.",
                },
                {
                  d: "Fri",
                  t: "Property tax rebate window extended till 30 April for early payers.",
                },
                {
                  d: "Wed",
                  t: "New Anganwadi enrolment drive begins across 82 zones.",
                },
                {
                  d: "Tue",
                  t: "Monsoon preparedness inspection concluded in 340 buildings.",
                },
              ].map((a) => (
                <li key={a.t} className="py-3 flex gap-4">
                  <div className="w-10 shrink-0 rounded-md bg-secondary text-center py-2 text-xs font-semibold text-primary">
                    {a.d}
                  </div>
                  <div className="text-sm text-foreground/80">{a.t}</div>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" />
              <h3 className="font-display text-lg font-semibold">
                Emergency contacts
              </h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                ["Police", "100"],
                ["Fire", "101"],
                ["Ambulance", "108"],
                ["Women Helpline", "1091"],
                ["Municipal Control Room", "155303"],
              ].map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                >
                  <span className="opacity-80">{k}</span>
                  <span className="font-display text-lg text-accent">{v}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* RESOURCES */}
      <Section
        eyebrow="Resources"
        title="Guides, stories & the latest from ULBs"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((a) => (
            <Link key={a.title} to="/resources">
              <Card className="overflow-hidden h-full transition hover:-translate-y-0.5 hover:shadow-elevated">
                <img
                  src={a.cover}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  alt=""
                  className="h-44 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent-foreground/80 font-medium">
                      {a.tag}
                    </span>
                    <span>{a.read} read</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-primary">
                    {a.title}
                  </h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* MOBILE APP */}
      <section className="border-t border-border/60 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary">
              Your city, in your pocket.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Get complaint updates, tax reminders and emergency alerts on the
              NagarSeva mobile app.
            </p>
            <div className="mt-6 flex gap-3">
              <button className="rounded-xl bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                Google Play
              </button>
              <button className="rounded-xl bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                App Store
              </button>
            </div>
          </div>
          <div>
            <img
              src={phoneImg}
              width={1024}
              height={1024}
              loading="lazy"
              alt="Mobile app preview"
              className="rounded-3xl shadow-card"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <Section>
        <div className="rounded-3xl bg-hero-gradient p-10 md:p-16 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Bring your ULB onto NagarSeva.
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-white/80">
            A production-grade platform, deployed and configured for your
            municipality in weeks — not years.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/admin">
              <Button className="bg-accent text-primary hover:bg-accent/90">
                Request a demo
              </Button>
            </Link>
            <Link to="/resources">
              <Button
                variant="outline"
                className="bg-transparent border-white/40 text-white hover:bg-white/10"
              >
                Read case studies
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
