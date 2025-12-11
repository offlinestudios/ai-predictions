import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/DashboardChat";
import History from "./pages/History";
import Account from "./pages/Account";
import Analytics from "./pages/Analytics";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SharedPrediction from "./pages/SharedPrediction";
import Onboarding from "./pages/Onboarding";
import PsycheOnboarding from "./pages/PsycheOnboarding";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DataSecurity from "./pages/DataSecurity";
import AIMethodology from "./pages/AIMethodology";
import Disclaimer from "./pages/Disclaimer";
import About from "./pages/About";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/sign-in"} component={SignIn} />
      <Route path={"/sign-up"} component={SignUp} />
      <Route path={"/onboarding"} component={Onboarding} />
      <Route path={"/psyche-onboarding"} component={PsycheOnboarding} />
      <Route path={"/dashboard"} component={Dashboard} />
      {/* Old dashboard available at /dashboard-old for reference */}
      {/* <Route path={"/dashboard-old"} component={DashboardOld} /> */}
      <Route path={"/history"} component={History} />
      <Route path={"/account"} component={Account} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/share/:token"} component={SharedPrediction} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/privacy"} component={PrivacyPolicy} />
      <Route path={"/terms"} component={TermsOfService} />
      <Route path={"/data-security"} component={DataSecurity} />
      <Route path={"/ai-methodology"} component={AIMethodology} />
      <Route path={"/disclaimer"} component={Disclaimer} />
      <Route path={"/about"} component={About} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
