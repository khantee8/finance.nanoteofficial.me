"use client";
import { useState } from "react";
import type { View } from "@/lib/types";
import { Shell } from "@/components/Shell";
import { ScreenLogin } from "@/components/screens/ScreenLogin";
import { ScreenAdvisorDashboard } from "@/components/screens/ScreenAdvisorDashboard";
import { ScreenClientList } from "@/components/screens/ScreenClientList";
import { ScreenClientProfile } from "@/components/screens/ScreenClientProfile";
import { ScreenPortfolioAnalytics } from "@/components/screens/ScreenPortfolioAnalytics";
import { ScreenGoals } from "@/components/screens/ScreenGoals";
import { ScreenRiskProfile } from "@/components/screens/ScreenRiskProfile";
import { ScreenRecommend } from "@/components/screens/ScreenRecommend";
import { ScreenReports } from "@/components/screens/ScreenReports";
import { ScreenCompliance } from "@/components/screens/ScreenCompliance";
import { ScreenClientView } from "@/components/screens/ScreenClientView";
import { ScreenAdminDashboard } from "@/components/screens/ScreenAdminDashboard";
import { ScreenClientRiskAnalysis } from "@/components/screens/ScreenClientRiskAnalysis";
import { ScreenClientProjection } from "@/components/screens/ScreenClientProjection";
import { ScreenClientMonteCarlo } from "@/components/screens/ScreenClientMonteCarlo";
import { ScreenClientScenario } from "@/components/screens/ScreenClientScenario";
import { ScreenClientSnapshot } from "@/components/screens/ScreenClientSnapshot";

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [initialView, setInitialView] = useState<View>("advisor");

  if (!loggedIn) {
    return (
      <ScreenLogin
        onLogin={(role) => {
          setInitialView(role);
          setLoggedIn(true);
        }}
      />
    );
  }

  return (
    <Shell initialView={initialView}>
      {({ route, view, persona, ccy, onNav }) => {
        if (view === "admin") {
          switch (route) {
            case "Compliance":  return <ScreenCompliance ccy={ccy} />;
            case "Reports":     return <ScreenReports ccy={ccy} />;
            default:            return <ScreenAdminDashboard />;
          }
        }

        if (view === "client") {
          switch (route) {
            case "ClientHome":   return <ScreenClientView ccy={ccy} persona={persona} />;
            case "Portfolio":    return <ScreenPortfolioAnalytics ccy={ccy} persona={persona} />;
            case "RiskAnalysis": return <ScreenClientRiskAnalysis ccy={ccy} persona={persona} />;
            case "Projection":   return <ScreenClientProjection ccy={ccy} persona={persona} />;
            case "MonteCarlo":   return <ScreenClientMonteCarlo ccy={ccy} persona={persona} />;
            case "Scenario":     return <ScreenClientScenario ccy={ccy} persona={persona} />;
            case "Goals":        return <ScreenGoals ccy={ccy} persona={persona} />;
            case "Risk":         return <ScreenRiskProfile ccy={ccy} persona={persona} />;
            case "Snapshot":     return <ScreenClientSnapshot ccy={ccy} persona={persona} />;
            case "Reports":      return <ScreenReports ccy={ccy} />;
            default:             return <ScreenClientView ccy={ccy} persona={persona} />;
          }
        }

        // Advisor view
        switch (route) {
          case "Dashboard":       return <ScreenAdvisorDashboard ccy={ccy} onOpenClient={() => onNav("Profile")} />;
          case "Clients":         return <ScreenClientList ccy={ccy} onOpenClient={() => onNav("Profile")} />;
          case "Profile":         return <ScreenClientProfile ccy={ccy} persona={persona} onNav={onNav} />;
          case "Portfolio":       return <ScreenPortfolioAnalytics ccy={ccy} persona={persona} />;
          case "Goals":           return <ScreenGoals ccy={ccy} persona={persona} />;
          case "Risk":            return <ScreenRiskProfile ccy={ccy} persona={persona} />;
          case "Projection":      return <ScreenClientProjection ccy={ccy} persona={persona} />;
          case "MonteCarlo":      return <ScreenClientMonteCarlo ccy={ccy} persona={persona} />;
          case "Scenarios":       return <ScreenClientScenario ccy={ccy} persona={persona} />;
          case "Recommendations": return <ScreenRecommend ccy={ccy} persona={persona} />;
          case "Reports":         return <ScreenReports ccy={ccy} />;
          case "Compliance":      return <ScreenCompliance ccy={ccy} />;
          default:                return <ScreenAdvisorDashboard ccy={ccy} onOpenClient={() => onNav("Profile")} />;
        }
      }}
    </Shell>
  );
}
