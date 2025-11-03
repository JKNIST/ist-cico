import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Overview from "./pages/Overview";
import PedagogicalWork from "./pages/PedagogicalWork";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Overview /></AppLayout>} />
          <Route path="/pedagogiskt-arbete" element={<PedagogicalWork />} />
          <Route path="/aktuellt" element={<AppLayout><div className="p-6">Aktuellt</div></AppLayout>} />
          <Route path="/schema" element={<AppLayout><div className="p-6">Schema</div></AppLayout>} />
          <Route path="/placeringar" element={<AppLayout><div className="p-6">Placeringar</div></AppLayout>} />
          <Route path="/utskrifter" element={<AppLayout><div className="p-6">Utskrifter</div></AppLayout>} />
          <Route path="/analys" element={<AppLayout><div className="p-6">Analys</div></AppLayout>} />
          <Route path="/kalender" element={<AppLayout><div className="p-6">Kalender</div></AppLayout>} />
          <Route path="/administration" element={<AppLayout><div className="p-6">Administration</div></AppLayout>} />
          <Route path="/maltidsplanering" element={<AppLayout><div className="p-6">Måltidsplanering</div></AppLayout>} />
          <Route path="/formular" element={<AppLayout><div className="p-6">Formulär</div></AppLayout>} />
          <Route path="/blogg" element={<AppLayout><div className="p-6">Blogg</div></AppLayout>} />
          <Route path="/chatt" element={<AppLayout><div className="p-6">Chatt</div></AppLayout>} />
          <Route path="/samtalsbokningar" element={<AppLayout><div className="p-6">Samtalsbokningar</div></AppLayout>} />
          <Route path="/document-manager" element={<AppLayout><div className="p-6">Document Manager</div></AppLayout>} />
          <Route path="/om" element={<AppLayout><div className="p-6">Om Lämna & hämta</div></AppLayout>} />
          <Route path="/forbattringsforslag" element={<AppLayout><div className="p-6">Förbättringsförslag</div></AppLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
