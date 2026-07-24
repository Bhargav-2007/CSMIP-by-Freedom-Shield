import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceForm, type FieldDef } from "@/components/site/ServiceForm";
import {
  Baby,
  Heart,
  Users,
  IndianRupee,
  MapPin,
  Accessibility,
  Home,
  Sparkles,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates · CivicHub" },
      {
        name: "description",
        content:
          "Apply for birth, death, marriage, income, caste, disability and residence certificates online.",
      },
      { property: "og:url", content: "/certificates" },
    ],
    links: [{ rel: "canonical", href: "/certificates" }],
  }),
  component: CertificatesPage,
});

type CertKey =
  | "birth"
  | "death"
  | "marriage"
  | "income"
  | "residence"
  | "disability"
  | "caste";

const certs: Array<{
  key: CertKey;
  icon: LucideIcon;
  name: string;
  sla: string;
  fee: string;
  docs: number;
}> = [
  {
    key: "birth",
    icon: Baby,
    name: "Birth Certificate",
    sla: "7 days",
    fee: "₹50",
    docs: 3,
  },
  {
    key: "death",
    icon: Heart,
    name: "Death Certificate",
    sla: "7 days",
    fee: "₹50",
    docs: 3,
  },
  {
    key: "marriage",
    icon: Users,
    name: "Marriage Certificate",
    sla: "15 days",
    fee: "₹200",
    docs: 5,
  },
  {
    key: "income",
    icon: IndianRupee,
    name: "Income Certificate",
    sla: "21 days",
    fee: "₹30",
    docs: 4,
  },
  {
    key: "residence",
    icon: MapPin,
    name: "Residence Certificate",
    sla: "10 days",
    fee: "₹30",
    docs: 3,
  },
  {
    key: "disability",
    icon: Accessibility,
    name: "Disability Certificate",
    sla: "30 days",
    fee: "Free",
    docs: 4,
  },
  {
    key: "caste",
    icon: Home,
    name: "Caste Certificate",
    sla: "21 days",
    fee: "₹30",
    docs: 5,
  },
];

const fieldMap: Record<CertKey, { fields: FieldDef[]; docs: string[] }> = {
  birth: {
    fields: [
      { name: "childName", label: "Child's full name", required: true },
      { name: "dob", label: "Date of birth", type: "date", required: true },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["Male", "Female", "Other"],
        required: true,
      },
      {
        name: "placeOfBirth",
        label: "Place of birth (hospital / address)",
        required: true,
        col: 2,
      },
      { name: "fatherName", label: "Father's name", required: true },
      { name: "motherName", label: "Mother's name", required: true },
      {
        name: "address",
        label: "Present address",
        type: "textarea",
        required: true,
      },
    ],
    docs: [
      "Hospital discharge summary (PDF)",
      "Parents' Aadhaar (PDF)",
      "Address proof (PDF)",
    ],
  },
  death: {
    fields: [
      { name: "deceasedName", label: "Deceased's full name", required: true },
      { name: "dod", label: "Date of death", type: "date", required: true },
      { name: "placeOfDeath", label: "Place of death", required: true, col: 2 },
      { name: "cause", label: "Cause of death", required: true },
      {
        name: "relation",
        label: "Applicant's relation",
        type: "select",
        options: ["Spouse", "Son", "Daughter", "Parent", "Other"],
        required: true,
      },
    ],
    docs: [
      "Medical certificate of death (PDF)",
      "Aadhaar of deceased (PDF)",
      "Applicant Aadhaar (PDF)",
    ],
  },
  marriage: {
    fields: [
      { name: "groomName", label: "Groom's full name", required: true },
      { name: "brideName", label: "Bride's full name", required: true },
      { name: "dom", label: "Date of marriage", type: "date", required: true },
      { name: "placeOfMarriage", label: "Place of marriage", required: true },
      {
        name: "witness1",
        label: "Witness 1 (name + Aadhaar last 4)",
        required: true,
        col: 2,
      },
      {
        name: "witness2",
        label: "Witness 2 (name + Aadhaar last 4)",
        required: true,
        col: 2,
      },
    ],
    docs: [
      "Both Aadhaars (PDF)",
      "Marriage invitation / photos (PDF)",
      "Witness IDs (PDF)",
      "Priest declaration (PDF)",
    ],
  },
  income: {
    fields: [
      { name: "applicantName", label: "Applicant name", required: true },
      {
        name: "annualIncome",
        label: "Annual household income (₹)",
        type: "number",
        required: true,
      },
      { name: "occupation", label: "Occupation", required: true },
      {
        name: "purpose",
        label: "Purpose of certificate",
        type: "textarea",
        required: true,
      },
    ],
    docs: [
      "Aadhaar (PDF)",
      "Last 3 salary slips OR Form 16 (PDF)",
      "Bank statement — 6 months (PDF)",
      "Ration card (PDF)",
    ],
  },
  residence: {
    fields: [
      { name: "applicantName", label: "Applicant name", required: true },
      {
        name: "address",
        label: "Present address",
        type: "textarea",
        required: true,
      },
      {
        name: "yearsAtAddress",
        label: "Years at this address",
        type: "number",
        required: true,
      },
    ],
    docs: [
      "Aadhaar (PDF)",
      "Utility bill — last 3 months (PDF)",
      "Rent agreement / property doc (PDF)",
    ],
  },
  disability: {
    fields: [
      { name: "applicantName", label: "Applicant name", required: true },
      { name: "dob", label: "Date of birth", type: "date", required: true },
      {
        name: "disabilityType",
        label: "Type of disability",
        type: "select",
        options: ["Locomotor", "Visual", "Hearing", "Intellectual", "Multiple"],
        required: true,
      },
      {
        name: "percentage",
        label: "Percentage of disability (%)",
        type: "number",
      },
    ],
    docs: [
      "Aadhaar (PDF)",
      "Medical evaluation report (PDF)",
      "Passport photo (JPG)",
      "Address proof (PDF)",
    ],
  },
  caste: {
    fields: [
      { name: "applicantName", label: "Applicant name", required: true },
      { name: "caste", label: "Caste / Sub-caste", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: ["SC", "ST", "OBC", "EWS", "General"],
        required: true,
      },
      { name: "purpose", label: "Purpose", type: "textarea", required: true },
    ],
    docs: [
      "Aadhaar (PDF)",
      "Parent's caste certificate (PDF)",
      "Address proof (PDF)",
      "Ration card (PDF)",
      "School leaving certificate (PDF)",
    ],
  },
};

const steps = [
  {
    n: 1,
    t: "Choose certificate",
    d: "Pick the certificate type and verify eligibility.",
  },
  {
    n: 2,
    t: "AI form filling",
    d: "Seva AI reads your DigiLocker documents and drafts the form.",
  },
  {
    n: 3,
    t: "Upload proofs",
    d: "Attach supporting documents — auto-OCR verified.",
  },
  {
    n: 4,
    t: "Review & pay",
    d: "Confirm details, pay the fee via UPI or card.",
  },
  {
    n: 5,
    t: "Track & download",
    d: "Get real-time status; download the signed certificate.",
  },
];

function CertificatesPage() {
  const [active, setActive] = useState<CertKey | null>(null);
  const activeCert = certs.find((c) => c.key === active);

  return (
    <>
      <PageHero
        eyebrow="Certificates"
        title="Government-issued certificates, without the paperwork."
        intro="Apply, upload PDFs, pay and download — digitally signed and DigiLocker-ready."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((c) => (
            <Card
              key={c.name}
              className={`p-6 transition hover:-translate-y-0.5 hover:shadow-elevated ${active === c.key ? "ring-2 ring-accent" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-saffron-gradient text-white">
                  <c.icon className="h-6 w-6" />
                </div>
                <Badge variant="secondary">{c.sla}</Badge>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-primary">
                {c.name}
              </h3>
              <div className="mt-1 text-sm text-muted-foreground">
                Fee {c.fee} · {c.docs} documents required
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setActive(c.key);
                    setTimeout(
                      () =>
                        document
                          .getElementById("apply-form")
                          ?.scrollIntoView({ behavior: "smooth" }),
                      50,
                    );
                  }}
                >
                  Apply
                </Button>
                <Button size="sm" variant="outline">
                  <Sparkles className="h-3 w-3 mr-1 text-accent" />
                  AI apply
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {activeCert && (
        <Section eyebrow="Application" title={`Apply for ${activeCert.name}`}>
          <div id="apply-form">
            <ServiceForm
              service={activeCert.name}
              category="certificate"
              idPrefix="CERT"
              fee={activeCert.fee}
              requiredDocs={fieldMap[activeCert.key].docs}
              fields={fieldMap[activeCert.key].fields}
              intro="Fill the details, attach the listed PDFs, and submit. You'll get a live tracking ID."
            />
          </div>
        </Section>
      )}

      <Section eyebrow="How it works" title="Five steps, minutes not months">
        <ol className="grid gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.n} className="relative">
              <Card className="h-full p-5">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground font-display font-semibold">
                  {s.n}
                </div>
                <h4 className="mt-3 font-display font-semibold text-primary">
                  {s.t}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </Card>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent" />
              )}
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <Card className="p-8 md:p-12 bg-hero-gradient text-white">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold">
                Every certificate you'll ever need — in one vault.
              </h2>
              <p className="mt-3 text-white/80">
                Your DigiLocker-linked profile stores every certificate ever
                issued.
              </p>
              <Button className="mt-6 bg-accent text-primary hover:bg-accent/90">
                Open my vault
              </Button>
            </div>
            <ul className="grid gap-3">
              {[
                "Aadhaar-verified issuance",
                "Digitally signed PDFs",
                "QR code for offline verification",
                "One-tap DigiLocker sync",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3"
                >
                  <Check className="h-4 w-4 text-accent" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </Section>
    </>
  );
}
