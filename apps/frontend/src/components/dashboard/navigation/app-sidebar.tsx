import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { sections } from "./sections";
import { SidebarMenuHeader } from "./sidebar-header";
import { UserMenu } from "./user-menu";

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarMenuHeader />
      <SidebarContent className="mt-12">
        <SidebarMenu>
          {sections.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.url}
                  className={
                    location.pathname === item.url ? "font-semibold" : ""
                  }
                >
                  <item.icon />
                  <span className="text-base">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
