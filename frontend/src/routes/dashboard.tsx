import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  Users,
  Home,
  FileText,
  ClipboardList,
  Wallet,
  Bell,
  Settings,
  FileSpreadsheet,
  Download,
  LogOut,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  useApplications,
  useSession,
  useLogout,
  type ServiceApplication,
  type Session,
} from "@/lib/store";
import { exportApplicationsToExcel } from "@/lib/exports";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Citizen Dashboard · CivicHub" },
      {
        name: "description",
        content: "Your applications, payments, documents and notifications.",
      },
    ],
  }),
  component: DashboardLayout,
});

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/track", label: "Track applications", icon: Activity },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/family", label: "Family", icon: Users },
  { to: "/properties", label: "Properties", icon: Home },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/applications", label: "Applications", icon: ClipboardList },
  { to: "/payments/history", label: "Payments", icon: Wallet },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

function DashboardLayout() {
  const { data: session } = useSession();
  const { data: apps = [] } = useApplications();
  const logout = useLogout();

  const name = session?.name || "Ramesh Mehta";
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          <div className="mb-4 rounded-2xl bg-hero-gradient p-5 text-white">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white/15 font-display font-bold">
              {initials}
            </div>
            <div className="mt-3 font-display font-semibold">{name}</div>
            <div className="text-xs opacity-70">
              {session
                ? `${session.id} · ${session.method}`
                : "Ward 4 · Navrangpura"}
            </div>
          </div>
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
              activeProps={{
                className: "bg-secondary font-medium text-primary",
              }}
              activeOptions={{ exact: !!n.exact }}
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
          {session && (
            <button
              onClick={() => logout.mutate()}
              className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger/10"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          )}
        </aside>
        <DashboardOverview apps={apps} />
      </div>
    </div>
  );
}

function DashboardOverview({ apps }: { apps: ServiceApplication[] }) {
  const activeCount = apps.filter(
    (a) => a.status !== "Completed" && a.status !== "Approved",
  ).length;
  const totalPaid = apps
    .filter((a) => a.category === "payment")
    .reduce((s, a) => s + (a.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          [String(activeCount || 3), "Active applications"],
          [
            `₹${totalPaid ? totalPaid.toLocaleString("en-IN") : "21,110"}`,
            totalPaid ? "Paid this session" : "Pending dues",
          ],
          ["12", "Certificates"],
          [
            String(apps.filter((a) => a.category === "complaint").length || 2),
            "Open complaints",
          ],
        ].map(([v, l]) => (
          <Card key={l} className="p-5">
            <div className="font-display text-2xl font-semibold text-primary">
              {v}
            </div>
            <div className="text-xs text-muted-foreground">{l}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-primary">
            My activity
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => exportApplicationsToExcel(apps)}
              disabled={!apps.length}
            >
              <FileSpreadsheet className="h-4 w-4" /> Export to Excel
            </Button>
            <Link to="/track">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                Open tracker
              </Button>
            </Link>
          </div>
        </div>
        {apps.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No live activity yet. Submit a form from Payments, Certificates,
            Complaints or Schemes to see it here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border text-sm">
            {apps.slice(0, 6).map((a) => (
              <li
                key={a.id}
                className="py-3 flex flex-wrap justify-between gap-3"
              >
                <span>
                  <span className="font-mono text-xs text-muted-foreground mr-2">
                    {a.id}
                  </span>
                  {a.service}
                </span>
                <span className="text-muted-foreground text-xs">
                  {a.status} ·{" "}
                  {new Date(a.createdAt).toLocaleDateString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="font-display text-lg font-semibold text-primary">
          Recent activity
        </h3>
        <ul className="mt-4 divide-y divide-border text-sm">
          {[
            ["Property Tax Q4 paid", "₹12,120 · UPI · 12 Feb"],
            [
              "Birth certificate issued for Aanya Mehta",
              "Downloaded to DigiLocker · 4 Feb",
            ],
            [
              "Complaint CMP-8421 assigned to Ward Officer",
              "In progress · 2 Apr",
            ],
            ["Water bill for Dec paid", "₹780 · GPay · 5 Jan"],
          ].map(([t, m]) => (
            <li key={t} className="py-3 flex justify-between gap-3">
              <span>{t}</span>
              <span className="text-muted-foreground text-xs">{m}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display font-semibold text-primary">Upcoming</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between rounded-lg bg-secondary/60 px-3 py-2">
              <span>Property Tax due</span>
              <span className="text-danger font-medium">31 Mar</span>
            </li>
            <li className="flex justify-between rounded-lg bg-secondary/60 px-3 py-2">
              <span>Trade License renewal</span>
              <span>22 May</span>
            </li>
          </ul>
        </Card>
        <Card className="p-6 bg-primary text-primary-foreground">
          <h3 className="font-display font-semibold">Seva AI recommends</h3>
          <p className="mt-2 text-sm opacity-80">
            You may qualify for the Property Tax rebate scheme. Save ~₹1,200 by
            paying by 30 April.
          </p>
        </Card>
      </div>
    </div>
  );
}
