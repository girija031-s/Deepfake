import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FacialLiveness from "./pages/FacialLiveness";
import VoiceBiometrics from "./pages/VoiceBiometrics";
import BehavioralBiometrics from "./pages/BehavioralBiometrics";
import RiskEngine from "./pages/RiskEngine";
import Architecture from "./pages/Architecture";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/facial" element={<FacialLiveness />} />
          <Route path="/auth/voice" element={<VoiceBiometrics />} />
          <Route path="/auth/behavioral" element={<BehavioralBiometrics />} />
          <Route path="/auth/risk" element={<RiskEngine />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
