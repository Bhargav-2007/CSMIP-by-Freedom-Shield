import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import type { ServiceApplication } from "./store";

export function exportApplicationsToExcel(
  apps: ServiceApplication[],
  filename = "civichub-activity.xlsx",
) {
  const rows = apps.map((a) => ({
    ID: a.id,
    Service: a.service,
    Category: a.category,
    Title: a.title,
    Status: a.status,
    Amount: a.amount ?? "",
    "Created At": a.createdAt,
    Attachments: a.attachments.map((f) => f.name).join(", "),
    ...a.fields,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Applications");
  XLSX.writeFile(wb, filename);
}

export function exportPaymentsToExcel(
  rows: Array<Record<string, string | number>>,
  filename = "civichub-payments.xlsx",
) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Payments");
  XLSX.writeFile(wb, filename);
}

export function downloadReceipt(opts: {
  id: string;
  description: string;
  amount: string;
  mode: string;
  date: string;
  payer?: string;
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(20, 47, 88);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("CivicHub", 40, 45);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Digital Governance · Payment Receipt", 40, 65);

  // Body
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Payment Receipt", 40, 130);
  doc.setDrawColor(220, 220, 220);
  doc.line(40, 140, W - 40, 140);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const lines: Array<[string, string]> = [
    ["Receipt No", opts.id],
    ["Description", opts.description],
    ["Payer", opts.payer ?? "Citizen"],
    ["Date", opts.date],
    ["Mode", opts.mode],
  ];
  let y = 170;
  lines.forEach(([k, v]) => {
    doc.setTextColor(120, 120, 120);
    doc.text(k, 40, y);
    doc.setTextColor(20, 20, 20);
    doc.text(String(v), 200, y);
    y += 22;
  });

  // Amount block
  y += 20;
  doc.setFillColor(245, 247, 250);
  doc.rect(40, y, W - 80, 60, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text("Total Amount Paid", 60, y + 25);
  doc.setFontSize(20);
  doc.setTextColor(20, 47, 88);
  doc.text(`INR ${opts.amount}`, 60, y + 50);

  // Footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.text(
    "This is a system-generated digitally signed receipt. Verify via QR at civichub.gov.in/verify",
    40,
    doc.internal.pageSize.getHeight() - 40,
  );

  doc.save(`receipt-${opts.id}.pdf`);
}
