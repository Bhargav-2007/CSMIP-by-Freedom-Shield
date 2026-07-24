import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Fingerprint,
  Smartphone,
  KeyRound,
  Mail,
  Lock,
  User,
  IdCard,
  Building2,
  Sparkles,
  Check,
} from "lucide-react";
import api, { setAuthTokens } from "@/lib/api";
import { useMunicipalities } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · CivicHub" },
      {
        name: "description",
        content:
          "Sign in to CivicHub with DigiLocker, Aadhaar or email — for citizens and officers.",
      },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup";
type Role = "citizen" | "officer";
type Method = "digilocker" | "aadhaar" | "mpin" | "password";

function AuthPage() {
  const nav = useNavigate();
  const { data: municipalities = [] } = useMunicipalities();
  const [role, setRole] = useState<Role>("citizen");
  const [mode, setMode] = useState<Mode>("signin");
  const [method, setMethod] = useState<Method>("digilocker");
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (method === "password") {
      try {
        const payload =
          mode === "signin"
            ? { email: form.email, password: form.password }
            : {
                email: form.email,
                password: form.password,
                confirm_password: form.confirmPassword || form.password,
                full_name: form.name,
                mobile: form.mobile,
                role,
                municipality_id:
                  role === "officer"
                    ? form.municipalityId || municipalities[0]?.id
                    : undefined,
                department: role === "officer" ? form.department : "",
                employee_id: role === "officer" ? form.employeeId || "" : "",
              };

        const endpoint = mode === "signin" ? "/auth/login/" : "/auth/register/";
        const response = await api.post(endpoint, payload);
        setAuthTokens(response.data.access, response.data.refresh);
        window.dispatchEvent(new Event("civichub:auth-updated"));
        nav({ to: role === "officer" ? "/officer/dashboard" : "/dashboard" });
        return;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign-in failed");
        return;
      }
    }

    if (mode === "signin") {
      try {
        // Fallback prototypes for non-password methods.
        const name =
          form.name ||
          form.email?.split("@")[0] ||
          (role === "officer" ? "Officer" : "Citizen");
        const id =
          role === "officer"
            ? "OFF-" + Math.floor(1000 + Math.random() * 9000)
            : "CIT-" + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem(
          "civichub.auth.v1",
          JSON.stringify({ role, name, id, method }),
        );
        window.dispatchEvent(new Event("civichub:auth-updated"));
        nav({ to: role === "officer" ? "/officer/dashboard" : "/dashboard" });
        return;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign-in failed");
        return;
      }
    }

    const name =
      form.name ||
      form.email?.split("@")[0] ||
      (role === "officer" ? "Officer" : "Citizen");
    const id =
      role === "officer"
        ? "OFF-" + Math.floor(1000 + Math.random() * 9000)
        : "CIT-" + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem(
      "civichub.auth.v1",
      JSON.stringify({ role, name, id, method }),
    );
    window.dispatchEvent(new Event("civichub:auth-updated"));
    nav({ to: role === "officer" ? "/officer/dashboard" : "/dashboard" });
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-160px)] max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_1fr]">
      <aside className="hidden overflow-hidden rounded-3xl bg-hero-gradient p-10 text-white lg:block">
        <div className="flex items-center gap-2 text-sm opacity-80">
          <Shield className="h-4 w-4" /> Government of India · Secure sign-in
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold leading-tight">
          One CivicHub identity for every municipal service.
        </h1>
        <p className="mt-4 max-w-md text-white/80">
          Verified via Aadhaar & DigiLocker. Your documents, applications,
          receipts and family details stay linked to a single, portable
          identity.
        </p>
        <ul className="mt-8 grid gap-3">
          {[
            "Aadhaar-authenticated (eKYC via UIDAI)",
            "DigiLocker vault sync — no re-uploads",
            "SMS OTP + m-PIN + biometric fallback",
            "GDPR + DPDP Act 2023 compliant",
          ].map((f) => (
            <li
              key={f}
              className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm"
            >
              <Check className="h-4 w-4 text-accent" /> {f}
            </li>
          ))}
        </ul>
        <div className="mt-10 rounded-2xl bg-white/5 p-5">
          <div className="flex items-center gap-2 text-sm opacity-80">
            <Sparkles className="h-4 w-4 text-accent" /> New this month
          </div>
          <div className="mt-1 font-display text-lg font-semibold">
            Face-auth via UIDAI now live for over-60 citizens.
          </div>
        </div>
      </aside>

      <div>
        <Card className="p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {mode === "signin" ? "Sign in" : "Create an account"}
              </div>
              <h2 className="font-display text-2xl font-semibold text-primary">
                Welcome to CivicHub
              </h2>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" /> Encrypted
            </Badge>
          </div>

          {/* Role tabs */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1">
            {(["citizen", "officer"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  role === r
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {r === "citizen" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Building2 className="h-4 w-4" />
                )}
                {r === "citizen" ? "Citizen" : "Officer / Staff"}
              </button>
            ))}
          </div>

          {/* Method picker */}
          <div className="mt-6 grid gap-2">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Sign-in method
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <MethodButton
                active={method === "digilocker"}
                onClick={() => setMethod("digilocker")}
                icon={IdCard}
                title="DigiLocker"
                desc="One-tap federated login"
                tag="Recommended"
              />
              <MethodButton
                active={method === "aadhaar"}
                onClick={() => setMethod("aadhaar")}
                icon={Fingerprint}
                title="Aadhaar OTP"
                desc="UIDAI eKYC via mobile OTP"
              />
              <MethodButton
                active={method === "mpin"}
                onClick={() => setMethod("mpin")}
                icon={Smartphone}
                title="Mobile + m-PIN"
                desc="Registered mobile number"
              />
              <MethodButton
                active={method === "password"}
                onClick={() => setMethod("password")}
                icon={KeyRound}
                title={
                  role === "officer"
                    ? "Employee ID + Password"
                    : "Email + Password"
                }
                desc="Traditional sign-in"
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            {mode === "signup" && (
              <FormField label="Full name" icon={User}>
                <Input
                  placeholder="As per Aadhaar"
                  required
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </FormField>
            )}

            {mode === "signup" && (
              <FormField label="Email address" icon={Mail}>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </FormField>
            )}

            {mode === "signup" && (
              <FormField label="Password" icon={Lock}>
                <Input
                  type="password"
                  placeholder="Create a password"
                  required
                  value={form.password || ""}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </FormField>
            )}

            {mode === "signup" && (
              <FormField label="Confirm password" icon={Lock}>
                <Input
                  type="password"
                  placeholder="Repeat password"
                  required
                  value={form.confirmPassword || ""}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
              </FormField>
            )}

            {mode === "signup" && role === "officer" && (
              <FormField label="Municipality" icon={Building2}>
                <select
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.municipalityId || municipalities[0]?.id || ""}
                  onChange={(e) =>
                    setForm({ ...form, municipalityId: e.target.value })
                  }
                  required
                >
                  <option value="">Select municipality…</option>
                  {municipalities.map((municipality) => (
                    <option key={municipality.id} value={municipality.id}>
                      {municipality.name}
                    </option>
                  ))}
                </select>
              </FormField>
            )}

            {mode === "signup" && role === "officer" && (
              <FormField label="Department" icon={Building2}>
                <Input
                  placeholder="e.g. Revenue"
                  required
                  value={form.department || ""}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                />
              </FormField>
            )}

            {mode === "signup" && role === "officer" && (
              <FormField label="Employee ID" icon={IdCard}>
                <Input
                  placeholder="e.g. AMC-4821"
                  value={form.employeeId || ""}
                  onChange={(e) =>
                    setForm({ ...form, employeeId: e.target.value })
                  }
                />
              </FormField>
            )}

            {method === "digilocker" && (
              <div className="rounded-xl border border-border p-4 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <IdCard className="h-4 w-4 text-accent" /> Continue with
                  DigiLocker
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  You will be redirected to{" "}
                  <span className="font-mono">digilocker.gov.in</span> to
                  authorise CivicHub. We only read the documents you approve.
                </p>
              </div>
            )}

            {method === "aadhaar" && (
              <>
                <FormField
                  label="Aadhaar number (12 digits)"
                  icon={Fingerprint}
                >
                  <Input
                    inputMode="numeric"
                    pattern="\d{12}"
                    maxLength={12}
                    placeholder="XXXX XXXX XXXX"
                    required
                    value={form.aadhaar || ""}
                    onChange={(e) =>
                      setForm({ ...form, aadhaar: e.target.value })
                    }
                  />
                </FormField>
                <FormField
                  label="OTP sent to Aadhaar-linked mobile"
                  icon={Smartphone}
                >
                  <Input
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit OTP"
                    required
                    value={form.otp || ""}
                    onChange={(e) => setForm({ ...form, otp: e.target.value })}
                  />
                </FormField>
                <div className="text-xs text-muted-foreground">
                  By continuing you consent to UIDAI eKYC as per Aadhaar Act,
                  2016.
                </div>
              </>
            )}

            {method === "mpin" && (
              <>
                <FormField label="Registered mobile" icon={Smartphone}>
                  <Input
                    inputMode="tel"
                    maxLength={10}
                    placeholder="10-digit mobile"
                    required
                    value={form.mobile || ""}
                    onChange={(e) =>
                      setForm({ ...form, mobile: e.target.value })
                    }
                  />
                </FormField>
                <FormField label="m-PIN (4 digits)" icon={KeyRound}>
                  <Input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="••••"
                    required
                    value={form.mpin || ""}
                    onChange={(e) => setForm({ ...form, mpin: e.target.value })}
                  />
                </FormField>
              </>
            )}

            {method === "password" && (
              <>
                <FormField
                  label={role === "officer" ? "Employee ID" : "Email address"}
                  icon={role === "officer" ? Building2 : Mail}
                >
                  <Input
                    type={role === "officer" ? "text" : "email"}
                    placeholder={
                      role === "officer" ? "e.g. AMC-4821" : "you@example.com"
                    }
                    required
                    value={form.email || ""}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </FormField>
                <FormField label="Password" icon={Lock}>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    required
                    value={form.password || ""}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </FormField>
                {role === "officer" && (
                  <FormField label="Department" icon={Building2}>
                    <select
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.department || ""}
                      onChange={(e) =>
                        setForm({ ...form, department: e.target.value })
                      }
                    >
                      <option value="">Select department…</option>
                      <option>Revenue</option>
                      <option>Public Health</option>
                      <option>Engineering</option>
                      <option>Water Works</option>
                      <option>Solid Waste</option>
                      <option>Town Planning</option>
                    </select>
                  </FormField>
                )}
              </>
            )}

            <Button
              type="submit"
              className="mt-2 bg-primary hover:bg-primary/90"
            >
              {mode === "signin" ? "Sign in securely" : "Create account"}
            </Button>

            {error && (
              <div className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
                {error}
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>
                  New citizen?{" "}
                  <button
                    type="button"
                    className="text-accent underline"
                    onClick={() => setMode("signup")}
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button
                    type="button"
                    className="text-accent underline"
                    onClick={() => setMode("signin")}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
            <span>Powered by MeitY · India Stack</span>
            <span>
              v1.0 ·{" "}
              <a href="#" className="hover:text-primary">
                Privacy
              </a>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MethodButton({
  active,
  onClick,
  icon: Icon,
  title,
  desc,
  tag,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  tag?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${active ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border hover:border-accent/50"}`}
    >
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${active ? "bg-accent text-primary" : "bg-secondary text-muted-foreground"}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{title}</div>
          {tag && (
            <span className="rounded-full bg-emerald/15 px-2 py-0.5 text-[10px] font-medium text-emerald">
              {tag}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}

function FormField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
