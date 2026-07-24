import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const users = [
  ["U-0001", "Ramesh Mehta", "Citizen", "Active"],
  ["U-0002", "Meena Patil", "Ward Officer", "Active"],
  ["U-0003", "Sanjay Rao", "Zonal Officer", "Active"],
  ["U-0004", "Kavya Iyer", "Deputy Commissioner", "Active"],
  ["U-0005", "Rohit Shah", "Admin", "Active"],
  ["U-0006", "Priya Nair", "Fire Officer", "Suspended"],
];

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users · Admin · NagarSeva" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-primary">
          Users
        </h1>
        <Button className="bg-primary hover:bg-primary/90">Invite user</Button>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(([id, n, r, s]) => (
              <tr key={id}>
                <td className="px-5 py-3 font-medium">{id}</td>
                <td className="px-5 py-3">{n}</td>
                <td className="px-5 py-3 text-muted-foreground">{r}</td>
                <td className="px-5 py-3">
                  <Badge
                    className={
                      s === "Active"
                        ? "bg-emerald/15 text-emerald hover:bg-emerald/15"
                        : "bg-danger/15 text-danger hover:bg-danger/15"
                    }
                  >
                    {s}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <Button size="sm" variant="ghost">
                    Manage
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  ),
});
