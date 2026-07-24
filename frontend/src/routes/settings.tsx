import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · NagarSeva" }] }),
  component: () => (
    <Card className="p-6 md:p-8 space-y-6">
      <h2 className="font-display text-2xl font-semibold text-primary">
        Settings
      </h2>
      {[
        ["Language", "English", "Change"],
        ["Notification channels", "Push, SMS, Email", "Manage"],
        ["Linked accounts", "DigiLocker, Aadhaar", "Manage"],
        ["Two-factor authentication", "Enabled", "Disable"],
        ["Data & privacy", "Download your data", "Request"],
      ].map(([l, v, a]) => (
        <div
          key={l as string}
          className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
        >
          <div>
            <div className="font-medium">{l}</div>
            <div className="text-sm text-muted-foreground">{v}</div>
          </div>
          <Button variant="outline" size="sm">
            {a}
          </Button>
        </div>
      ))}
    </Card>
  ),
});
