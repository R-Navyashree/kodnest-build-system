import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  projectName: string;
  currentStep: number;
  totalSteps: number;
  status: "not-started" | "in-progress" | "shipped";
}

const statusConfig = {
  "not-started": { label: "Not Started", variant: "secondary" as const },
  "in-progress": { label: "In Progress", variant: "warning" as const },
  "shipped": { label: "Shipped", variant: "success" as const },
};

export function TopBar({ projectName, currentStep, totalSteps, status }: TopBarProps) {
  const { label, variant } = statusConfig[status];

  return (
    <header className="flex items-center justify-between border-b border-border px-sp-4 py-sp-2 bg-card">
      <span className="font-heading text-lg font-semibold text-foreground">{projectName}</span>
      <span className="text-sm text-muted-foreground font-body">
        Step {currentStep} / {totalSteps}
      </span>
      <Badge variant={variant}>{label}</Badge>
    </header>
  );
}

interface ContextHeaderProps {
  headline: string;
  subtext: string;
}

export function ContextHeader({ headline, subtext }: ContextHeaderProps) {
  return (
    <section className="px-sp-4 py-sp-4 border-b border-border">
      <h1 className="text-foreground">{headline}</h1>
      <p className="mt-sp-1 text-muted-foreground">{subtext}</p>
    </section>
  );
}

interface PageLayoutProps {
  topBar: ReactNode;
  contextHeader: ReactNode;
  workspace: ReactNode;
  panel: ReactNode;
  footer: ReactNode;
}

export function PageLayout({ topBar, contextHeader, workspace, panel, footer }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      {topBar}
      {contextHeader}
      <div className="flex flex-1 border-b border-border">
        <main className="w-[70%] border-r border-border p-sp-4">{workspace}</main>
        <aside className="w-[30%] p-sp-3">{panel}</aside>
      </div>
      <footer className="px-sp-4 py-sp-3">{footer}</footer>
    </div>
  );
}
