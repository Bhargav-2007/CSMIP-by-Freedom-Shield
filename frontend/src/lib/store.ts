import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export type AppStatus =
  | "Submitted"
  | "Under Review"
  | "In Progress"
  | "Approved"
  | "Rejected"
  | "Completed";

export type TimelineStep = {
  label: string;
  when: string;
  by: string;
  state: "done" | "current" | "pending";
};

export type Attachment = { name: string; size: number; type: string };

export type ServiceApplication = {
  id: string;
  applicationNumber?: string;
  service: string;
  serviceId?: string;
  municipalityId?: string;
  category:
    | "certificate"
    | "payment"
    | "complaint"
    | "scheme"
    | "license"
    | "booking"
    | "rti";
  title: string;
  fields: Record<string, string>;
  attachments: Attachment[];
  status: AppStatus;
  timeline: TimelineStep[];
  createdAt: string;
  amount?: number;
};

type BackendApplication = {
  id: string;
  application_number: string;
  service_name: string;
  service_category: ServiceApplication["category"];
  status: string;
  amount?: string | number | null;
  created_at: string;
};

type BackendService = {
  id: string;
  name: string;
  slug: string;
  category: ServiceApplication["category"];
  description: string;
  municipality_name?: string | null;
};

type BackendMunicipality = {
  id: string;
  name: string;
  slug: string;
  state: string;
  short_name?: string;
};

type BackendComplaint = {
  id: string;
  complaint_number: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  ward_name?: string | null;
  location: string;
  sla_deadline?: string | null;
  is_overdue: boolean;
  escalation_count: number;
  created_at: string;
};

type BackendPayment = {
  id: string;
  transaction_id: string;
  payment_type: string;
  description: string;
  total_amount: string | number;
  status: string;
  mode: string;
  period: string;
  paid_at?: string | null;
  created_at: string;
};

const STATUS_MAP: Record<string, AppStatus> = {
  submitted: "Submitted",
  under_review: "Under Review",
  in_progress: "In Progress",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
};

function normalizeStatus(status: string): AppStatus {
  return STATUS_MAP[status] ?? (status as AppStatus) ?? "Submitted";
}

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  return typeof value === "number" ? value : Number(value);
}

function mapApplication(application: BackendApplication): ServiceApplication {
  return {
    id: application.application_number || application.id,
    applicationNumber: application.application_number,
    service: application.service_name,
    category: application.service_category,
    title: application.service_name,
    fields: {},
    attachments: [],
    status: normalizeStatus(application.status),
    timeline: defaultTimeline(application.service_category),
    createdAt: application.created_at,
    amount: toNumber(application.amount),
  };
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get("/services/");
      const payload = Array.isArray(response.data)
        ? response.data
        : (response.data?.results ?? []);
      return payload as BackendService[];
    },
  });
}

export function useMunicipalities() {
  return useQuery({
    queryKey: ["municipalities"],
    queryFn: async () => {
      const response = await api.get("/municipalities/");
      const payload = Array.isArray(response.data)
        ? response.data
        : (response.data?.results ?? []);
      return payload as BackendMunicipality[];
    },
  });
}

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await api.get("/applications/");
      const payload = Array.isArray(response.data)
        ? response.data
        : (response.data?.results ?? []);
      return (payload as BackendApplication[]).map(mapApplication);
    },
  });
}

export function useSaveApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (app: ServiceApplication) => {
      if (!app.serviceId || !app.municipalityId) {
        return app;
      }

      const response = await api.post("/applications/", {
        service_id: app.serviceId,
        municipality_id: app.municipalityId,
        fields_data: app.fields,
        amount: app.amount ?? 0,
      });

      const created = response.data as {
        id: string;
        application_number: string;
        service?: { name: string; category: ServiceApplication["category"] };
        status: string;
        amount?: string | number | null;
        created_at: string;
      };

      return {
        ...app,
        id: created.application_number || created.id,
        applicationNumber: created.application_number,
        service: created.service?.name ?? app.service,
        category: created.service?.category ?? app.category,
        title: created.service?.name ?? app.title,
        status: normalizeStatus(created.status),
        amount: toNumber(created.amount) ?? app.amount,
        createdAt: created.created_at ?? app.createdAt,
      } satisfies ServiceApplication;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function makeId(prefix: string) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const y = new Date().getFullYear();
  return `${prefix}-${y}-${rand}`;
}

export function defaultTimeline(
  category: ServiceApplication["category"],
): TimelineStep[] {
  const now = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return [
    { label: "Submitted", when: now, by: "You", state: "done" },
    { label: "Processing", when: "Pending", by: "System", state: "current" },
  ];
}

// -------- auth --------
export type Session = {
  role: "citizen" | "officer" | "admin";
  name: string;
  id: string;
  method: string;
  email?: string;
  displayId?: string;
  municipality?: {
    id: string;
    name: string;
    slug?: string;
    state?: string;
  } | null;
};

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;
      try {
        const response = await api.get("/auth/me/");
        const user = response.data as {
          id: string;
          role: Session["role"];
          full_name: string;
          display_id: string;
          email: string;
          municipality?: {
            id: string;
            name: string;
            slug?: string;
            state?: string;
          } | null;
        };

        return {
          id: user.display_id ?? user.id,
          displayId: user.display_id,
          role: user.role,
          name: user.full_name,
          email: user.email,
          method: "password",
          municipality: user.municipality ?? null,
        } satisfies Session;
      } catch {
        return null;
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api
          .post("/auth/logout/", { refresh: refreshToken })
          .catch(() => {});
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    onSuccess: () => {
      queryClient.setQueryData(["session"], null);
      window.location.href = "/";
    },
  });
}

export function useComplaints() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: async () => {
      const response = await api.get("/complaints/");
      const payload = Array.isArray(response.data)
        ? response.data
        : (response.data?.results ?? []);
      return payload as BackendComplaint[];
    },
  });
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await api.get("/payments/");
      const payload = Array.isArray(response.data)
        ? response.data
        : (response.data?.results ?? []);
      return payload as BackendPayment[];
    },
  });
}
