import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { FloatingAsk } from "@/components/app/floating-ask";
import { PROJECT } from "@/lib/mock-project";

/**
 * Product shell — every page under /(app)/* renders inside this layout.
 *
 * The left sidebar is persistent and identifies the user's current device
 * project. The top bar carries search + notifications. A floating
 * "Ask Conformly" button is available on every page so the user can ask
 * a regulatory question without losing context.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-60">
        <Topbar projectName={PROJECT.name} />
        <main className="pb-24">{children}</main>
      </div>
      <FloatingAsk />
    </div>
  );
}
