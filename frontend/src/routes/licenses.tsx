import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceForm, type FieldDef } from "@/components/site/ServiceForm";
import {
  Briefcase,
  Store,
  Truck,
  HardHat,
  Flame,
  Utensils,
  Building2,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/licenses")({
  head: () => ({
    meta: [
      { title: "Licenses & Permits · CivicHub" },
      {
        name: "description",
        content:
          "Trade licenses, shop registration, contractor registration, building permits, fire & food NOCs.",
      },
      { property: "og:url", content: "/licenses" },
    ],
    links: [{ rel: "canonical", href: "/licenses" }],
  }),
  component: LicensesPage,
});

const items = [
  {
    icon: Briefcase,
    name: "Trade License",
    desc: "For any commercial establishment.",
    sla: "10 days",
    fee: "₹2,000",
    fields: [
      { name: "businessName", label: "Business name", required: true },
      { name: "ownerName", label: "Owner name", required: true },
      { name: "gst", label: "GSTIN (optional)" },
      {
        name: "address",
        label: "Business address",
        type: "textarea",
        required: true,
      },
      { name: "activity", label: "Nature of business", required: true, col: 2 },
    ] as FieldDef[],
    docs: [
      "PAN (PDF)",
      "Owner Aadhaar (PDF)",
      "Rent agreement / ownership (PDF)",
    ],
  },
  {
    icon: Store,
    name: "Shop Registration",
    desc: "Under the S&E Act.",
    sla: "7 days",
    fee: "₹800",
    fields: [
      { name: "shopName", label: "Shop name", required: true },
      {
        name: "employees",
        label: "Number of employees",
        type: "number",
        required: true,
      },
      {
        name: "address",
        label: "Shop address",
        type: "textarea",
        required: true,
      },
    ] as FieldDef[],
    docs: [
      "Owner Aadhaar (PDF)",
      "Rent agreement (PDF)",
      "Photograph of shop (JPG)",
    ],
  },
  {
    icon: Truck,
    name: "Vendor Registration",
    desc: "Street vendor certificate.",
    sla: "14 days",
    fee: "₹250",
    fields: [
      { name: "vendorName", label: "Vendor name", required: true },
      { name: "goodsType", label: "Type of goods", required: true },
      {
        name: "location",
        label: "Vending location",
        type: "textarea",
        required: true,
      },
    ] as FieldDef[],
    docs: ["Aadhaar (PDF)", "Photograph (JPG)", "Existing TVC (if any) (PDF)"],
  },
  {
    icon: HardHat,
    name: "Contractor Registration",
    desc: "Empanelment for civil works.",
    sla: "21 days",
    fee: "₹5,000",
    fields: [
      { name: "firmName", label: "Firm / contractor name", required: true },
      {
        name: "class",
        label: "Class of registration",
        type: "select",
        required: true,
        options: ["Class I", "Class II", "Class III"],
      },
      {
        name: "turnover",
        label: "Annual turnover (₹)",
        type: "number",
        required: true,
      },
    ] as FieldDef[],
    docs: [
      "PAN (PDF)",
      "GST cert (PDF)",
      "Balance sheet — last 3 yrs (PDF)",
      "Work orders (PDF)",
    ],
  },
  {
    icon: Flame,
    name: "Fire NOC",
    desc: "Fire safety no-objection.",
    sla: "21 days",
    fee: "₹3,500",
    fields: [
      { name: "premiseName", label: "Premise name", required: true },
      {
        name: "builtUp",
        label: "Built-up area (sq. m)",
        type: "number",
        required: true,
      },
      {
        name: "occupancy",
        label: "Occupancy type",
        type: "select",
        required: true,
        options: [
          "Residential",
          "Commercial",
          "Institutional",
          "Industrial",
          "Assembly",
        ],
      },
    ] as FieldDef[],
    docs: [
      "Building plan (PDF)",
      "Fire safety plan (PDF)",
      "Ownership doc (PDF)",
    ],
  },
  {
    icon: Utensils,
    name: "Food License Guidance",
    desc: "FSSAI + municipal health.",
    sla: "15 days",
    fee: "₹1,200",
    fields: [
      { name: "outletName", label: "Outlet name", required: true },
      { name: "fssai", label: "Existing FSSAI ID (if any)" },
      { name: "cuisine", label: "Cuisine / food type", required: true },
    ] as FieldDef[],
    docs: ["Aadhaar (PDF)", "Kitchen layout (PDF)", "Water test report (PDF)"],
  },
  {
    icon: Building2,
    name: "Building Permission",
    desc: "Plan approval & OC.",
    sla: "45 days",
    fee: "As per plinth area",
    fields: [
      { name: "plotNo", label: "Plot / survey number", required: true },
      {
        name: "plotArea",
        label: "Plot area (sq. m)",
        type: "number",
        required: true,
      },
      {
        name: "floors",
        label: "Proposed floors",
        type: "number",
        required: true,
      },
      {
        name: "usage",
        label: "Usage",
        type: "select",
        required: true,
        options: ["Residential", "Commercial", "Mixed"],
      },
    ] as FieldDef[],
    docs: [
      "Title deed (PDF)",
      "Architect drawings (PDF)",
      "Soil report (PDF)",
      "Structural report (PDF)",
    ],
  },
  {
    icon: ClipboardList,
    name: "Hoarding Permit",
    desc: "Outdoor advertising.",
    sla: "15 days",
    fee: "Slab-based",
    fields: [
      { name: "advertiser", label: "Advertiser name", required: true },
      {
        name: "location",
        label: "Hoarding location",
        type: "textarea",
        required: true,
      },
      { name: "size", label: "Size (ft x ft)", required: true },
      {
        name: "duration",
        label: "Duration (months)",
        type: "number",
        required: true,
      },
    ] as FieldDef[],
    docs: [
      "Site photo (JPG)",
      "Structural stability cert (PDF)",
      "Landowner NoC (PDF)",
    ],
  },
];

function LicensesPage() {
  const [active, setActive] = useState<(typeof items)[number] | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Licenses & Permits"
        title="Set up shop, build a home, run a business — all with clear paperwork."
        intro="Guided applications with checklists, document validation and status tracking."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <Card
              key={i.name}
              className={`p-5 ${active?.name === i.name ? "ring-2 ring-accent" : ""}`}
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <i.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-primary">
                {i.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{i.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary">{i.sla}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActive(i);
                    setTimeout(
                      () =>
                        document
                          .getElementById("lic-form")
                          ?.scrollIntoView({ behavior: "smooth" }),
                      50,
                    );
                  }}
                >
                  Start →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {active && (
        <Section eyebrow="Application" title={`Apply for ${active.name}`}>
          <div id="lic-form">
            <ServiceForm
              service={active.name}
              category="license"
              idPrefix="LIC"
              fee={active.fee}
              requiredDocs={active.docs}
              fields={active.fields}
              intro="Attach the listed PDFs and submit. Officers verify within SLA."
            />
          </div>
        </Section>
      )}
    </>
  );
}
