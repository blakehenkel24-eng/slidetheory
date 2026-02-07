import { Metadata } from "next";
import { LandingClient } from "./landing-client";

export const metadata: Metadata = {
  title: "SlideTheory — AI Slides for Strategy Consultants",
  description: "Generate McKinsey, Bain, BCG-quality slides in 30 seconds. Built for strategy consultants and PE professionals.",
  keywords: ["AI slides", "consulting", "McKinsey", "Bain", "BCG", "presentation", "strategy"],
  openGraph: {
    title: "SlideTheory — AI Slides for Strategy Consultants",
    description: "Generate McKinsey, Bain, BCG-quality slides in 30 seconds.",
    type: "website",
  },
};

export default function LandingPage() {
  return <LandingClient />;
}
