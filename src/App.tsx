import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import Assessments from "./pages/Assessments";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
<<<<<<< HEAD
import History from "./pages/History";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import TestChecklist from "./pages/TestChecklist";
import Ship from "./pages/Ship";
import Proof from "./pages/Proof";
=======
import NotFound from "./pages/NotFound";
>>>>>>> bb95649c0dc004969166249ececa01b1e250fa4e

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="practice" element={<Practice />} />
            <Route path="assessments" element={<Assessments />} />
            <Route path="resources" element={<Resources />} />
            <Route path="profile" element={<Profile />} />
<<<<<<< HEAD
            <Route path="history" element={<History />} />
            <Route path="results" element={<Results />} />
          </Route>

          {/* PRP Verification Routes */}
          <Route path="/prp/07-test" element={<TestChecklist />} />
          <Route path="/prp/08-ship" element={<Ship />} />
          <Route path="/prp/proof" element={<Proof />} />

=======
          </Route>
>>>>>>> bb95649c0dc004969166249ececa01b1e250fa4e
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
