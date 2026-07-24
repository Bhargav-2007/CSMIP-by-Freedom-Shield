import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { ChatBot, type BotProfile } from "@/components/site/ChatBot";

const profiles: Record<string, BotProfile> = {
  complaints: {
    name: "Grievance Bot",
    role: "Complaints & escalation",
    intro:
      "Namaste! I can help you file, draft or escalate a civic complaint. What's happening in your area?",
    suggestions: [
      "Pothole on my street",
      "Broken streetlight",
      "Escalate CMP-8421",
      "Which ward am I in?",
    ],
    reply: (q) => {
      const s = q.toLowerCase();
      if (s.includes("pothole"))
        return "Got it. I'll open a Roads complaint. Please share a photo and pin the location. Ward Officer SLA is 48 hours; auto-escalates to Zonal after that.";
      if (s.includes("light"))
        return "Streetlights are handled by the Electrical wing. I'll pre-fill the form — I just need the pole number (usually on the base) or the nearest landmark.";
      if (s.includes("escalate"))
        return "Complaint CMP-8421 is 34 hrs old — within Ward Officer SLA. I can flag it for Zonal review with a note. Continue?";
      return "I can file a new complaint, check status, or explain the escalation matrix. Tell me the category (Roads, Water, Sanitation, Streetlight…) and location.";
    },
  },
  payments: {
    name: "Payments Bot",
    role: "Taxes & utility bills",
    intro:
      "Hi! I can look up bills, explain rebates and guide you through UPI payment.",
    suggestions: [
      "Property tax rebate?",
      "Pay water bill",
      "Show my dues",
      "Split into instalments",
    ],
    reply: (q) => {
      const s = q.toLowerCase();
      if (s.includes("rebate"))
        return "Pay full-year property tax by 30 April to get up to 10% rebate. On ₹12,480 that's about ₹1,248 saved.";
      if (s.includes("dues"))
        return "You have ₹21,110 outstanding across 5 accounts. Property Tax (₹12,480) is due in 8 days.";
      if (s.includes("instal"))
        return "Property tax can be split into 4 quarterly instalments with no interest if paid on time.";
      return "Tell me the bill (Property Tax, Water, Drainage, Trade License) or say 'pay all' and I'll queue everything for UPI.";
    },
  },
  certificates: {
    name: "Certificate Bot",
    role: "Birth, Death, Income, Caste…",
    intro:
      "Hello! Which certificate do you need? I'll list documents, fees and expected time.",
    suggestions: [
      "Birth certificate",
      "Income certificate",
      "Marriage — needed docs?",
      "Track my application",
    ],
    reply: (q) => {
      const s = q.toLowerCase();
      if (s.includes("birth"))
        return "Birth certificate: ₹50, 7 days. Documents — Hospital discharge, Parents' Aadhaar, Address proof. Shall I open the form?";
      if (s.includes("income"))
        return "Income certificate: ₹30, 21 days. Docs — Aadhaar, salary slips (3 months) or Form 16, bank statement, ration card.";
      if (s.includes("marriage"))
        return "Marriage certificate: ₹200, 15 days. Docs — Both Aadhaars, wedding invitation/photos, 2 witnesses' IDs, priest declaration.";
      if (s.includes("track"))
        return "Share the tracking ID (e.g. CERT-2025-1234) and I'll fetch the live status.";
      return "I handle Birth, Death, Marriage, Income, Caste, Residence and Disability certificates. Which one?";
    },
  },
  schemes: {
    name: "Schemes Bot",
    role: "Eligibility & welfare",
    intro:
      "Answer a few quick questions and I'll list schemes you qualify for — Central, State and Municipal.",
    suggestions: [
      "Am I eligible for PMAY?",
      "Girl child schemes",
      "Senior pension",
      "Widow benefits",
    ],
    reply: (q) => {
      const s = q.toLowerCase();
      if (s.includes("pmay"))
        return "PMAY-U eligibility: annual household income ≤ ₹18L (MIG-II) and no pucca house owned nationwide. Shall I check with your DigiLocker docs?";
      if (s.includes("girl"))
        return "Balika Samruddhi Yojana pays direct cash at girl-child milestones; Sukanya Samriddhi gives 8.2% tax-free savings. Both need Aadhaar + birth cert.";
      if (s.includes("senior"))
        return "Senior Citizen Pension: age ≥ 60, BPL household. Monthly benefit varies by state (₹500–₹1,500).";
      return "I check eligibility for 240+ schemes. Tell me your age, income and household details, or say 'start eligibility check'.";
    },
  },
  maps: {
    name: "City Maps Bot",
    role: "Wards, offices, projects",
    intro:
      "Ask me anything about ward boundaries, nearest offices or ongoing city projects.",
    suggestions: [
      "Nearest ward office",
      "Which ward is Navrangpura?",
      "Metro project status",
    ],
    reply: (q) => {
      const s = q.toLowerCase();
      if (s.includes("nearest"))
        return "Nearest ward office to your saved address: Ward 4 Office, Navrangpura — 1.2 km. Open Mon–Sat, 10:00–17:00.";
      if (s.includes("navrangpura"))
        return "Navrangpura falls under Ward 4, Zone West. Councillor: Smt. Meena Patel (term 2023–2028).";
      if (s.includes("metro"))
        return "Phase 2 Metro extension to Motera is 63% complete; expected trial run Q4 FY25.";
      return "Try: 'nearest hospital', 'find my ward', 'ongoing road works near me'.";
    },
  },
  general: {
    name: "Seva Assistant",
    role: "General civic help",
    intro:
      "Namaste! I'm Seva — ask me anything about municipal services. Hindi, English or Gujarati.",
    suggestions: [
      "What can CivicHub do?",
      "How to file RTI?",
      "Book a community hall",
      "Speak in Hindi",
    ],
    reply: (q) => {
      const s = q.toLowerCase();
      if (s.includes("rti"))
        return "File RTI online: /rti. Fee ₹10 by UPI, reply within 30 days (48 hrs for life/liberty). I can draft the application for you.";
      if (s.includes("hindi"))
        return "ज़रूर! आप हिन्दी में पूछ सकते हैं। मैं जन्म प्रमाणपत्र, पानी का बिल, शिकायत — किसी भी सेवा में मदद कर सकता हूँ।";
      if (s.includes("hall") || s.includes("book"))
        return "Community hall bookings: /bookings. Weekend rates ~₹4,500 with refundable deposit ₹2,000.";
      return "CivicHub covers 180+ municipal services — payments, certificates, complaints, schemes, licenses, RTI. What do you need?";
    },
  },
};

export const Route = createFileRoute("/ai/$bot")({
  head: ({ params }) => {
    const p = profiles[params.bot] ?? profiles.general;
    return {
      meta: [
        { title: `${p.name} · CivicHub AI` },
        { name: "description", content: p.role },
      ],
    };
  },
  component: BotPage,
});

function BotPage() {
  const { bot } = Route.useParams();
  const profile = profiles[bot] ?? profiles.general;
  return (
    <>
      <PageHero
        eyebrow="AI Assistant"
        title={profile.name}
        intro={profile.role}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <ChatBot profile={profile} />
        </div>
      </Section>
    </>
  );
}
