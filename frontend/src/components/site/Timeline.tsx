import { Check, Clock, Circle } from "lucide-react";
import type { TimelineStep } from "@/lib/store";

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((t, idx) => {
        const Icon =
          t.state === "done" ? Check : t.state === "current" ? Clock : Circle;
        return (
          <li key={idx} className="flex gap-3">
            <div
              className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                t.state === "done"
                  ? "bg-emerald text-white"
                  : t.state === "current"
                    ? "bg-accent text-primary"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <div className="font-medium">{t.label}</div>
              <div className="text-xs text-muted-foreground">
                {t.when} · {t.by}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
