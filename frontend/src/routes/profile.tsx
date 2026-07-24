import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · NagarSeva" }] }),
  component: () => (
    <Card className="p-6 md:p-8">
      <h2 className="font-display text-2xl font-semibold text-primary">
        Profile
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          ["Full name", "Ramesh Mehta"],
          ["Aadhaar", "XXXX XXXX 4821"],
          ["Mobile", "+91 98250 12345"],
          ["Email", "ramesh@example.com"],
          ["DOB", "12 Aug 1978"],
          ["Ward", "Ward 4 · Navrangpura"],
        ].map(([l, v]) => (
          <div key={l}>
            <label className="text-xs text-muted-foreground">{l}</label>
            <Input defaultValue={v} className="mt-1" />
          </div>
        ))}
      </div>
      <Button className="mt-6 bg-primary hover:bg-primary/90">
        Save changes
      </Button>
    </Card>
  ),
});
