import { SidebarProvider } from "@/components/ui/sidebar";
import { PedagogicalSidebar } from "@/components/PedagogicalSidebar";

export default function PedagogicalWorkLanding() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <PedagogicalSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-2xl font-semibold">Start page</h1>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}