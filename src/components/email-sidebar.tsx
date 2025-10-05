import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IconMail,
  IconChartBar,
  IconDashboard,
  IconUsers,
  IconUserPlus,
  IconSettings,
  IconHelp,
  IconCalendar,
  IconFileText,
  IconMessage,
  type Icon,
} from "@tabler/icons-react";

import { useAuth } from "@/context/AuthContext";
import { EmailNavMain } from "@/components/email-nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { EmailNavUser } from "@/components/email-nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type EmailSidebarProps = React.ComponentProps<typeof Sidebar>;

export function EmailSidebar(props: EmailSidebarProps) {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  // Main navigation items based on user role
  const getNavMain = () => {
    const baseItems = [
      {
        title: "Dashboard",
        url: "/",
        icon: IconDashboard,
        path: "/",
      },
      {
        title: "Create Campaign",
        url: "/create-campaign",
        icon: IconMail,
        path: "/create-campaign",
      },
      {
        title: "Manage Campaigns",
        url: "/manage-campaigns",
        icon: IconFileText,
        path: "/manage-campaigns",
      },
    ];

    // Add admin-only items
    if (isAdmin) {
      baseItems.push({
        title: "Existing Campaigns",
        url: "/existing-campaigns",
        icon: IconChartBar,
        path: "/existing-campaigns",
      });

      baseItems.push({
        title: "User Management",
        url: "/user-management",
        icon: IconUsers,
        path: "/user-management",
      });

      baseItems.push({
        title: "Create User",
        url: "/create-user",
        icon: IconUserPlus,
        path: "/create-user",
      });

      baseItems.push({
        title: "Analytics",
        url: "/analytics",
        icon: IconChartBar,
        path: "/analytics",
      });
    }

    return baseItems;
  };

  // Shared features navigation
  const navSharedFeatures = [
    {
      title: "Calendar",
      url: "#",
      icon: IconCalendar,
      disabled: true,
    },
    {
      title: "Templates",
      url: "#",
      icon: IconFileText,
      disabled: true,
    },
    {
      title: "Team Chat",
      url: "#",
      icon: IconMessage,
      disabled: true,
    },
  ];

  // Secondary navigation
  const navSecondary = [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      disabled: true,
    },
    {
      title: "Help",
      url: "#",
      icon: IconHelp,
      disabled: true,
    },
  ];

  // User data for the sidebar
  const userData = {
    name: user?.email?.split("@")[0] || "User",
    email: user?.email || "",
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`,
    role: user?.role || "USER",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <IconMail className="!size-5" />
                <span className="text-base font-semibold">Email Marketing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <EmailNavMain items={getNavMain()} currentPath={location.pathname} />
        <NavSharedFeatures items={navSharedFeatures} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <EmailNavUser user={userData} onLogout={logout} />
      </SidebarFooter>
    </Sidebar>
  );
}

// Custom NavSharedFeatures component for shared features
function NavSharedFeatures({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    onClick?: () => void;
    disabled?: boolean;
  }[];
}) {
  return (
    <div className="px-2 py-2">
      <div className="text-xs font-semibold text-sidebar-foreground/70 px-2 pb-2">
        SHARED FEATURES
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarMenuButton
            key={item.title}
            tooltip={item.title}
            onClick={item.onClick}
            disabled={item.disabled}
            className={`${
              item.disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {item.icon && <item.icon className="size-4" />}
            <span>{item.title}</span>
            {item.disabled && (
              <span className="ml-auto text-xs bg-sidebar-accent text-sidebar-accent-foreground px-1.5 py-0.5 rounded">
                Soon
              </span>
            )}
          </SidebarMenuButton>
        ))}
      </div>
    </div>
  );
}
