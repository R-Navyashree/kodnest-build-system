import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, ClipboardCheck, FolderOpen, User, History } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Practice", to: "/dashboard/practice", icon: BookOpen },
  { label: "Assessments", to: "/dashboard/assessments", icon: ClipboardCheck },
  { label: "History", to: "/dashboard/history", icon: History },
  { label: "Resources", to: "/dashboard/resources", icon: FolderOpen },
  { label: "Profile", to: "/dashboard/profile", icon: User },
];

export function DashboardSidebar() {
  const location = useLocation();

  return (
    <aside className="flex w-60 flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-5">
        <span className="text-lg font-bold text-sidebar-primary-foreground">PlacementPrep</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active =
            item.to === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
