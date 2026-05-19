import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { FloatingAsk } from "@/components/app/floating-ask";
import { ToastProvider } from "@/components/app/toast";

/**
 * Product shell — every page under /(app)/* renders inside this layout.
 *
 * The left sidebar is persistent and identifies the user's current device
 * project. The top bar carries search + notifications + ⌘K. A floating
 * "Ask Conformly" button is available on every page so the user can ask
 * a regulatory question without losing context.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-subtle">
      <Sidebar />
      <div className="md:pl-[252px]">
        {/* The topbar's pageTitle would normally come from each child page —
            we pass a generic "Workspace" label and let each page render its
            own h1 via the PageHeader atom. */}
        <Topbar pageTitle="Workspace" />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
      <FloatingAsk />
      <ToastProvider />
    </div>
  );
}
