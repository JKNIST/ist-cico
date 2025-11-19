import { Eye, FileText, Calendar, Grid3x3, BarChart3, CalendarDays, UserCog, FileEdit, Rss, MessageSquare, ClipboardList, FolderOpen, Info, ExternalLink, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  getUnreadInternalBlogCountFromStorage,
  updateUnreadInternalBlogCount,
} from "@/utils/blogUnreadCounter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  useSidebar,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UnreadMessagesPopover } from "@/features/layout/components/UnreadMessagesPopover";

export function AppSidebar() {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [unreadInternalBlogCount, setUnreadInternalBlogCount] = useState<number>(0);
  const [scheduleOpen, setScheduleOpen] = useState(
    location.pathname === "/schema" || location.pathname === "/schema/personal"
  );

  useEffect(() => {
    // Get initial unread count from localStorage
    const storedUnreadCount = localStorage.getItem('unreadMessages');
    if (storedUnreadCount) {
      setUnreadCount(parseInt(storedUnreadCount, 10));
    }

    // Listen for unread messages updates
    const handleUnreadMessagesUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      setUnreadCount(customEvent.detail.count);
    };

    window.addEventListener('unreadMessagesUpdated', handleUnreadMessagesUpdate);

    return () => {
      window.removeEventListener('unreadMessagesUpdated', handleUnreadMessagesUpdate);
    };
  }, []);

  useEffect(() => {
    const updateBlogUnreadCount = () => {
      const count = getUnreadInternalBlogCountFromStorage();
      setUnreadInternalBlogCount(count);
    };

    updateBlogUnreadCount();

    const handleBlogPostRead = () => {
      updateUnreadInternalBlogCount();
    };

    window.addEventListener("blogPostReadUpdated", handleBlogPostRead);
    window.addEventListener("unreadInternalBlogPostsUpdated", updateBlogUnreadCount);

    return () => {
      window.removeEventListener("blogPostReadUpdated", handleBlogPostRead);
      window.removeEventListener("unreadInternalBlogPostsUpdated", updateBlogUnreadCount);
    };
  }, []);

  const menuItems = [
    { title: t('sidebar.overview'), url: "/", icon: Eye },
    { title: t('sidebar.current'), url: "/aktuellt", icon: FileText, badge: 6 },
    { 
      title: t('sidebar.schedule'), 
      url: "/schema", 
      icon: Calendar,
      submenu: [
        { title: t('sidebar.staffSchedule'), url: "/schema/personal" }
      ]
    },
    { title: t('sidebar.placements'), url: "/placeringar", icon: Grid3x3 },
    { title: t('sidebar.prints'), url: "/utskrifter", icon: FileText },
    { title: t('sidebar.analysis'), url: "/analys", icon: BarChart3, external: true },
    { title: t('sidebar.calendar'), url: "/kalender", icon: CalendarDays },
    { title: t('sidebar.administration'), url: "/administration", icon: UserCog },
    { title: t('sidebar.mealPlanning'), url: "/maltidsplanering", icon: ClipboardList },
    { title: t('sidebar.forms'), url: "/formular", icon: FileEdit, external: true },
    { title: t('sidebar.pedagogicalWork'), url: "/pedagogiskt-arbete", icon: FolderOpen, external: true, opensNewTab: true },
    { title: t('sidebar.blog'), url: "/blogg", icon: Rss, badge: unreadInternalBlogCount > 0 ? unreadInternalBlogCount : undefined },
    { title: t('sidebar.chat'), url: "/chatt", icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
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
                  {item.submenu ? (
                    <Collapsible open={scheduleOpen} onOpenChange={setScheduleOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              `flex items-center gap-3 ${
                                isActive || location.pathname.startsWith("/schema")
                                  ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent"
                              } transition-colors`
                            }
                            end
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1">{item.title}</span>
                                <ChevronRight
                                  className={`h-4 w-4 transition-transform ${
                                    scheduleOpen ? "rotate-90" : ""
                                  }`}
                                />
                              </>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!isCollapsed && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.submenu.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink
                                    to={subItem.url}
                                    className={({ isActive }) =>
                                      `flex items-center gap-3 ${
                                        isActive
                                          ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                                      } transition-colors`
                                    }
                                  >
                                    <span>{subItem.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : item.url === "/chatt" && unreadCount > 0 ? (
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <div>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={item.url}
                              className={({ isActive }) =>
                                `flex items-center gap-3 ${
                                  isActive
                                    ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                                } transition-colors`
                              }
                              onClick={() => setPopoverOpen(false)}
                            >
                              <item.icon className="h-4 w-4 flex-shrink-0" />
                              {!isCollapsed && (
                                <>
                                  <span className="flex-1">{item.title}</span>
                                  {item.badge && (
                                    <span className="bg-chat-badge text-white px-2 py-0.5 rounded-full text-xs font-medium">
                                      {item.badge}
                                    </span>
                                  )}
                                </>
                              )}
                            </NavLink>
                          </SidebarMenuButton>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent 
                        side="right" 
                        align="start" 
                        className="w-96 p-0"
                        sideOffset={8}
                      >
                        <UnreadMessagesPopover onMessageClick={() => setPopoverOpen(false)} />
                      </PopoverContent>
                    </Popover>
                  ) : (
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
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
