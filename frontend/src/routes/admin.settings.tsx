import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Tenant Settings · Admin · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-primary mb-6">
        Tenant settings
      </h1>
      <Card className="p-6 md:p-8 space-y-5 max-w-3xl">
        {[
          ["Tenant name", "Ahmedabad Municipal Corporation"],
          ["Short code", "AMC"],
          ["Primary language", "Gujarati"],
          ["Timezone", "Asia/Kolkata"],
          ["Default SLA (days)", "10"],
          ["Support email", "support@amc.example"],
        ].map(([l, v]) => (
          <div key={l}>
            <label className="text-xs text-muted-foreground">{l}</label>
            <Input defaultValue={v} className="mt-1" />
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <Button className="bg-primary hover:bg-primary/90">Save</Button>
          <Button variant="outline">Reset</Button>
        </div>
      </Card>
    </div>
  ),
});
