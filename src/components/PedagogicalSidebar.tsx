import { Home, UserCog, Rss, Phone, FileText, ExternalLink } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Start page", url: "/", icon: Home, internal: true },
  { title: "Administration", url: "/administration", icon: UserCog, external: true },
  { title: "Pedagogisk dokumentation", url: "/pedagogiskt-arbete/dokumentation", icon: FileText, external: true, opensNewTab: true },
];

export function PedagogicalSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-lg p-2">
            <div className="w-8 h-8 bg-[#2a9d8f] rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sidebar-foreground font-semibold text-sm">Teacher</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.opensNewTab ? (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {item.external && (
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            )}
                          </>
                        )}
                      </a>
                    ) : item.internal ? (
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 ${
                            isActive
                              ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          } transition-colors`
                        }
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                          </>
                        )}
                      </NavLink>
                    ) : (
                      <a 
                        href={item.url}
                        className="flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {item.external && (
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            )}
                          </>
                        )}
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}