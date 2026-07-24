import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useApplications } from "@/lib/store";

export const Route = createFileRoute("/applications")({
  head: () => ({ meta: [{ title: "Applications · CivicHub" }] }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { data: apps = [], isLoading } = useApplications();

  return (
    <Card className="overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-5 py-3">ID</th>
            <th className="px-5 py-3">Service</th>
            <th className="px-5 py-3">Filed</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Amount</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {isLoading && (
            <tr>
              <td className="px-5 py-6 text-muted-foreground" colSpan={6}>
                Loading applications...
              </td>
            </tr>
          )}

          {!isLoading && apps.length === 0 && (
            <tr>
              <td className="px-5 py-6 text-muted-foreground" colSpan={6}>
                No applications found. Submit a service request from the citizen
                portal to see it here.
              </td>
            </tr>
          )}

          {apps.map((application) => (
            <tr key={application.id}>
              <td className="px-5 py-3 font-medium">
                {application.applicationNumber || application.id}
              </td>
              <td className="px-5 py-3">
                <div className="font-medium">{application.service}</div>
                <div className="text-xs text-muted-foreground">
                  {application.title}
                </div>
              </td>
              <td className="px-5 py-3 text-muted-foreground">
                {new Date(application.createdAt).toLocaleDateString("en-IN")}
              </td>
              <td className="px-5 py-3">
                <Badge className={statusTone(application.status)}>
                  {application.status}
                </Badge>
              </td>
              <td className="px-5 py-3 text-muted-foreground">
                {application.amount
                  ? `₹${application.amount.toLocaleString("en-IN")}`
                  : "—"}
              </td>
              <td className="px-5 py-3 text-right">
                <Link to="/track">
                  <Button size="sm" variant="ghost">
                    Track
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function statusTone(status: string) {
  const value = status.toLowerCase();
  if (value.includes("approved") || value.includes("completed")) {
    return "bg-emerald/15 text-emerald hover:bg-emerald/15";
  }

  if (value.includes("rejected")) {
    return "bg-danger/15 text-danger hover:bg-danger/15";
  }

  return "bg-warning/20 text-warning hover:bg-warning/20";
}
