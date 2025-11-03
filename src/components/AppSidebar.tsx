import { Eye, FileText, Calendar, Grid3x3, BarChart3, CalendarDays, UserCog, FileEdit, Rss, MessageSquare, ClipboardList, FolderOpen, Info, ExternalLink } from "lucide-react";
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
  { title: "Överblick", url: "/", icon: Eye },
  { title: "Aktuellt", url: "/aktuellt", icon: FileText, badge: 6 },
  { title: "Schema", url: "/schema", icon: Calendar },
  { title: "Placeringar", url: "/placeringar", icon: Grid3x3 },
  { title: "Utskrifter", url: "/utskrifter", icon: FileText },
  { title: "Analys", url: "/analys", icon: BarChart3, external: true },
  { title: "Kalender", url: "/kalender", icon: CalendarDays },
  { title: "Administration", url: "/administration", icon: UserCog },
  { title: "Måltidsplanering", url: "/maltidsplanering", icon: ClipboardList },
  { title: "Formulär", url: "/formular", icon: FileEdit, external: true },
  { title: "Pedagogiskt arbete", url: "/pedagogiskt-arbete", icon: FolderOpen, external: true, opensNewTab: true },
  { title: "Blogg", url: "/blogg", icon: Rss },
  { title: "Chatt", url: "/chatt", icon: MessageSquare },
  { title: "Samtalsbokningar", url: "/samtalsbokningar", icon: CalendarDays },
  { title: "Document manager", url: "/document-manager", icon: FolderOpen },
  { title: "Om Lämna & hämta", url: "/om", icon: Info },
  { title: "Förbättringsförslag", url: "/forbattringsforslag", icon: MessageSquare, external: true },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-lg p-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">LH</span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sidebar-foreground font-semibold text-sm">Lämna & hämta</span>
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
                            {item.badge && (
                              <span className="bg-white text-primary px-2 py-0.5 rounded text-xs font-medium">
                                {item.badge}
                              </span>
                            )}
                            {item.external && (
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            )}
                          </>
                        )}
                      </a>
                    ) : (
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
                            {item.badge && (
                              <span className="bg-white text-primary px-2 py-0.5 rounded text-xs font-medium">
                                {item.badge}
                              </span>
                            )}
                            {item.external && (
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            )}
                          </>
                        )}
                      </NavLink>
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
