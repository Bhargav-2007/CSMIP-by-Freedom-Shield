import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image as ImageIcon, Megaphone } from "lucide-react";

export const Route = createFileRoute("/admin/cms")({
  head: () => ({ meta: [{ title: "CMS · Admin · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-primary">
          Content Management
        </h1>
        <Button className="bg-primary hover:bg-primary/90">New notice</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <Megaphone className="h-5 w-5 text-accent" />
          <h3 className="mt-3 font-display font-semibold text-primary">
            Public notices
          </h3>
          <div className="mt-1 text-2xl font-display font-semibold">28</div>
          <div className="text-xs text-muted-foreground">
            14 published this month
          </div>
        </Card>
        <Card className="p-5">
          <FileText className="h-5 w-5 text-accent" />
          <h3 className="mt-3 font-display font-semibold text-primary">
            Pages
          </h3>
          <div className="mt-1 text-2xl font-display font-semibold">42</div>
          <div className="text-xs text-muted-foreground">
            Static content pages
          </div>
        </Card>
        <Card className="p-5">
          <ImageIcon className="h-5 w-5 text-accent" />
          <h3 className="mt-3 font-display font-semibold text-primary">
            Banners
          </h3>
          <div className="mt-1 text-2xl font-display font-semibold">6</div>
          <div className="text-xs text-muted-foreground">2 live now</div>
        </Card>
      </div>
    </div>
  ),
});
