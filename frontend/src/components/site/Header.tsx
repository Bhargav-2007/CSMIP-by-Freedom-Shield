import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Search, Menu, Globe, Sparkles, LogIn, Activity } from "lucide-react";
import { useState } from "react";
import { useSession, type Session } from "@/lib/store";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/payments", label: "Payments" },
  { to: "/certificates", label: "Certificates" },
  { to: "/complaints", label: "Complaints" },
  { to: "/schemes", label: "Schemes" },
  { to: "/licenses", label: "Licenses" },
  { to: "/track", label: "Track" },
  { to: "/ai", label: "AI" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="hidden md:block bg-primary text-primary-foreground text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5">
          <span className="opacity-80">
            Government of India · Digital India Initiative
          </span>
          <div className="flex items-center gap-4 opacity-90">
            <button className="flex items-center gap-1 hover:opacity-100">
              <Globe className="h-3 w-3" /> English
            </button>
            <Link to="/help-center" className="hover:opacity-100">
              Help
            </Link>
            <Link to="/auth" className="hover:opacity-100">
              Citizen Login
            </Link>
            <Link to="/auth" className="hover:opacity-100">
              Officer Login
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-saffron-gradient text-white font-display text-lg font-bold">
            C
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold text-primary">
              CivicHub
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Digital Governance
            </div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/75 hover:text-primary hover:bg-secondary transition-colors"
              activeProps={{ className: "text-primary bg-secondary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Search className="h-4 w-4" />
          </Button>
          <Link to="/ai" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> AI
            </Button>
          </Link>
          {session ? (
            <Link
              to={
                session.role === "officer" ? "/officer/dashboard" : "/dashboard"
              }
            >
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 gap-1.5"
              >
                <Activity className="h-3.5 w-3.5" />{" "}
                {session.name.split(" ")[0]}
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <div className="mx-auto max-w-7xl px-6 py-3 grid gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
