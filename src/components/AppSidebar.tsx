import { Eye, FileText, Calendar, Grid3x3, BarChart3, CalendarDays, UserCog, FileEdit, Rss, MessageSquare, ClipboardList, FolderOpen, Info, ExternalLink } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

export function AppSidebar() {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const menuItems = [
    { title: t('sidebar.overview'), url: "/", icon: Eye },
    { title: t('sidebar.current'), url: "/aktuellt", icon: FileText, badge: 6 },
    { title: t('sidebar.schedule'), url: "/schema", icon: Calendar },
    { title: t('sidebar.placements'), url: "/placeringar", icon: Grid3x3 },
    { title: t('sidebar.prints'), url: "/utskrifter", icon: FileText },
    { title: t('sidebar.analysis'), url: "/analys", icon: BarChart3, external: true },
    { title: t('sidebar.calendar'), url: "/kalender", icon: CalendarDays },
    { title: t('sidebar.administration'), url: "/administration", icon: UserCog },
    { title: t('sidebar.mealPlanning'), url: "/maltidsplanering", icon: ClipboardList },
    { title: t('sidebar.forms'), url: "/formular", icon: FileEdit, external: true },
    { title: t('sidebar.pedagogicalWork'), url: "/pedagogiskt-arbete", icon: FolderOpen, external: true, opensNewTab: true },
    { title: t('sidebar.blog'), url: "/blogg", icon: Rss },
    { title: t('sidebar.chat'), url: "/chatt", icon: MessageSquare },
    { title: t('sidebar.appointments'), url: "/samtalsbokningar", icon: CalendarDays },
    { title: t('sidebar.documentManager'), url: "/document-manager", icon: FolderOpen },
    { title: t('sidebar.about'), url: "/om", icon: Info },
    { title: t('sidebar.improvements'), url: "/forbattringsforslag", icon: MessageSquare, external: true },
  ];

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
