import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, Check, Sparkles } from "lucide-react";
import { Timeline } from "./Timeline";
import {
  defaultTimeline,
  makeId,
  useMunicipalities,
  useServices,
  useSession,
  useSaveApplication,
  type Attachment,
  type ServiceApplication,
} from "@/lib/store";

export type FieldDef =
  | {
      name: string;
      label: string;
      type?: "text" | "email" | "tel" | "number" | "date";
      placeholder?: string;
      required?: boolean;
      col?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "textarea";
      placeholder?: string;
      required?: boolean;
      col?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "select";
      options: string[];
      required?: boolean;
      col?: 1 | 2;
    };

export function ServiceForm({
  service,
  category,
  idPrefix,
  fields,
  fee,
  requiredDocs = ["Aadhaar (PDF)", "Address proof (PDF)"],
  intro,
}: {
  service: string;
  category: ServiceApplication["category"];
  idPrefix: string;
  fields: FieldDef[];
  fee?: string;
  requiredDocs?: string[];
  intro?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Attachment[]>([]);
  const [submitted, setSubmitted] = useState<null | {
    id: string;
    timeline: ServiceApplication["timeline"];
  }>(null);
  const { data: services = [] } = useServices();
  const { data: municipalities = [] } = useMunicipalities();
  const { data: session } = useSession();
  const saveApplication = useSaveApplication();

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []).map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
    }));
    setFiles((prev) => [...prev, ...list].slice(0, 8));
  }

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const serviceMatch =
      services.find(
        (entry) =>
          entry.category === category &&
          entry.name.toLowerCase().includes(service.toLowerCase()),
      ) ??
      services.find((entry) => entry.category === category) ??
      services[0];

    const municipalityMatch = session?.municipality?.id
      ? session.municipality
      : municipalities[0];

    const id = makeId(idPrefix);
    const timeline = defaultTimeline(category);
    const app: ServiceApplication = {
      id,
      service,
      serviceId: serviceMatch?.id,
      municipalityId: municipalityMatch?.id,
      category,
      title: values.title || service,
      fields: values,
      attachments: files,
      status: category === "payment" ? "Completed" : "Submitted",
      timeline,
      createdAt: new Date().toISOString(),
      amount: values.amount ? Number(values.amount) : undefined,
    };
    saveApplication.mutate(app);
    setSubmitted({ id, timeline });
  }

  if (submitted) {
    return (
      <Card className="p-6 md:p-8">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald text-white">
            <Check className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-semibold text-primary">
              Application received
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your tracking ID is{" "}
              <span className="font-mono font-semibold text-primary">
                {submitted.id}
              </span>
              . You can follow the progress below or from{" "}
              <a className="text-accent underline" href="/track">
                Track Applications
              </a>
              .
            </p>
          </div>
          <Badge className="bg-accent text-primary">Live</Badge>
        </div>
        <div className="mt-6 rounded-xl bg-secondary/60 p-5">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Process timeline
          </div>
          <Timeline steps={submitted.timeline} />
        </div>
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(null);
              setValues({});
              setFiles([]);
            }}
          >
            New application
          </Button>
          <a href="/track">
            <Button className="bg-primary hover:bg-primary/90">
              Go to tracking
            </Button>
          </a>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-xl font-semibold text-primary">
            {service} — Application form
          </h3>
          {intro && (
            <p className="mt-1 text-sm text-muted-foreground">{intro}</p>
          )}
        </div>
        {fee && <Badge variant="secondary">Fee {fee}</Badge>}
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((f) => (
            <div
              key={f.name}
              className={
                f.col === 2 || (f as FieldDef).type === "textarea"
                  ? "md:col-span-2"
                  : ""
              }
            >
              <label className="text-sm font-medium">
                {f.label} {f.required && <span className="text-danger">*</span>}
              </label>
              {"type" in f && f.type === "textarea" ? (
                <Textarea
                  className="mt-2 min-h-[100px]"
                  placeholder={f.placeholder}
                  required={f.required}
                  value={values[f.name] || ""}
                  onChange={(e) =>
                    setValues({ ...values, [f.name]: e.target.value })
                  }
                />
              ) : "type" in f && f.type === "select" ? (
                <select
                  required={f.required}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={values[f.name] || ""}
                  onChange={(e) =>
                    setValues({ ...values, [f.name]: e.target.value })
                  }
                >
                  <option value="">Select…</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  className="mt-2"
                  type={("type" in f && f.type) || "text"}
                  placeholder={"placeholder" in f ? f.placeholder : undefined}
                  required={f.required}
                  value={values[f.name] || ""}
                  onChange={(e) =>
                    setValues({ ...values, [f.name]: e.target.value })
                  }
                />
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="text-sm font-medium">
            Attach documents (PDF, JPG, PNG)
          </label>
          <div className="mt-2 rounded-xl border-2 border-dashed border-border p-5 text-center hover:border-accent hover:bg-accent/5">
            <label className="flex cursor-pointer flex-col items-center gap-2">
              <Upload className="h-6 w-6 text-accent" />
              <span className="text-sm font-medium">
                Click to upload or drag files here
              </span>
              <span className="text-xs text-muted-foreground">
                Up to 8 files · 10 MB each
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={onFileChange}
              />
            </label>
          </div>
          {requiredDocs.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              Required: {requiredDocs.join(" · ")}
            </div>
          )}
          {files.length > 0 && (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {files.map((f) => (
                <li
                  key={f.name}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <FileText className="h-4 w-4 text-accent" />
                  <span className="min-w-0 flex-1 truncate">{f.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(f.size / 1024)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(f.name)}
                    className="text-muted-foreground hover:text-danger"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-secondary/60 p-4 text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Not sure what to enter? Let Seva AI auto-fill from your DigiLocker
            profile.
          </div>
          <Button variant="outline" size="sm" type="button">
            Ask AI
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Submit application
          </Button>
          <Button type="button" variant="outline">
            Save draft
          </Button>
        </div>
      </form>
    </Card>
  );
}
