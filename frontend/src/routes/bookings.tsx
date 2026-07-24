import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { PageHero, Section } from "@/components/site/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceForm } from "@/components/site/ServiceForm";
import {
  Building2,
  Music,
  Trees,
  Trophy,
  Bed,
  Users,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "Public Facility Bookings · CivicHub" },
      {
        name: "description",
        content:
          "Reserve community halls, auditoriums, sports grounds, parks and meeting rooms.",
      },
      { property: "og:url", content: "/bookings" },
    ],
    links: [{ rel: "canonical", href: "/bookings" }],
  }),
  component: BookingsPage,
});

const facilities = [
  {
    icon: Building2,
    name: "Sardar Community Hall",
    cap: "300",
    rate: "₹8,000/day",
    loc: "Navrangpura",
  },
  {
    icon: Music,
    name: "Tagore Auditorium",
    cap: "800",
    rate: "₹22,000/day",
    loc: "Paldi",
  },
  {
    icon: Trophy,
    name: "Municipal Sports Complex",
    cap: "—",
    rate: "₹1,200/hr",
    loc: "Bopal",
  },
  {
    icon: Trees,
    name: "Riverfront Central Park",
    cap: "500",
    rate: "₹6,000/day",
    loc: "Riverfront",
  },
  {
    icon: Bed,
    name: "Municipal Guest House",
    cap: "24 rooms",
    rate: "₹1,800/night",
    loc: "Shahibaug",
  },
  {
    icon: Users,
    name: "Ward Meeting Room",
    cap: "40",
    rate: "Free (residents)",
    loc: "All wards",
  },
];

const slots = ["09:00–12:00", "12:00–15:00", "15:00–18:00", "18:00–22:00"];

function BookingsPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Bookings"
        title="Reserve municipal facilities in a few clicks."
        intro="Live availability, transparent pricing and instant e-receipts."
      />
      <Section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <Card
              key={f.name}
              className={`overflow-hidden ${active === f.name ? "ring-2 ring-accent" : ""}`}
            >
              <div className="h-32 bg-hero-gradient grid place-items-center">
                <f.icon className="h-10 w-10 text-white/80" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-primary">
                    {f.name}
                  </h3>
                  <Badge variant="secondary">{f.loc}</Badge>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Capacity {f.cap} · {f.rate}
                </div>
                <Button
                  className="mt-4 w-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setActive(f.name);
                    setTimeout(
                      () =>
                        document
                          .getElementById("book-form")
                          ?.scrollIntoView({ behavior: "smooth" }),
                      50,
                    );
                  }}
                >
                  Book this facility
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {active && (
        <Section eyebrow="Booking" title={`Reserve — ${active}`}>
          <div id="book-form">
            <ServiceForm
              service={`Booking · ${active}`}
              category="booking"
              idPrefix="BKG"
              fee="As per facility"
              requiredDocs={["Event permission letter (PDF, optional)"]}
              fields={[
                {
                  name: "eventTitle",
                  label: "Event / purpose",
                  required: true,
                  col: 2,
                },
                { name: "date", label: "Date", type: "date", required: true },
                {
                  name: "slot",
                  label: "Time slot",
                  type: "select",
                  required: true,
                  options: slots,
                },
                {
                  name: "expectedAttendees",
                  label: "Expected attendees",
                  type: "number",
                  required: true,
                },
                {
                  name: "contactPerson",
                  label: "Contact person",
                  required: true,
                },
                {
                  name: "mobile",
                  label: "Mobile",
                  type: "tel",
                  required: true,
                },
                {
                  name: "notes",
                  label: "Special requirements",
                  type: "textarea",
                },
              ]}
              intro="Refundable deposit ₹2,000 for community halls. Cancellation window: 72 hrs."
            />
          </div>
        </Section>
      )}

      <Section
        eyebrow="Live availability"
        title="Sardar Community Hall · This week"
      >
        <Card className="p-6">
          <div className="grid grid-cols-8 gap-2 text-center text-sm">
            <div></div>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="font-semibold text-muted-foreground">
                {d}
              </div>
            ))}
            {slots.map((slot, si) => (
              <Fragment key={slot}>
                <div className="text-left text-xs text-muted-foreground py-2">
                  {slot}
                </div>
                {[0, 1, 2, 3, 4, 5, 6].map((di) => {
                  const state = (si * 7 + di) % 5;
                  const cls =
                    state === 0
                      ? "bg-danger/15 text-danger"
                      : state === 1
                        ? "bg-warning/20 text-warning"
                        : "bg-emerald/15 text-emerald hover:bg-emerald hover:text-white cursor-pointer";
                  const label =
                    state === 0 ? "Booked" : state === 1 ? "Hold" : "Free";
                  return (
                    <div
                      key={`${si}-${di}`}
                      className={`rounded-md py-2 text-xs font-medium ${cls}`}
                    >
                      {label}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" /> Week of 8 April 2025
            </div>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setActive("Sardar Community Hall");
                setTimeout(
                  () =>
                    document
                      .getElementById("book-form")
                      ?.scrollIntoView({ behavior: "smooth" }),
                  50,
                );
              }}
            >
              Reserve selected slots
            </Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
