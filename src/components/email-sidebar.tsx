import * as React from "react"
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
} from "@tabler/icons-react"

import { useAuth } from "@/context/AuthContext"
import { EmailNavMain } from "@/components/email-nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { EmailNavUser } from "@/components/email-nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface EmailSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onNavigate: (view: string) => void;
}

export function EmailSidebar({ onNavigate, ...props }: EmailSidebarProps) {
  const { user, isAdmin, logout } = useAuth()

  // Main navigation items based on user role
  const getNavMain = () => {
    const baseItems = [
      {
        title: "Dashboard",
        url: "#",
        icon: IconDashboard,
        onClick: () => onNavigate('dashboard')
      },
      {
        title: "Campaigns",
        url: "#",
        icon: IconMail,
        onClick: () => onNavigate('emailComposer')
      },
      {
        title: "Subscribers",
        url: "#",
        icon: IconUsers,
        onClick: () => onNavigate('subscribers'),
        disabled: true,
        badge: "Soon"
      },
    ]

    // Add admin-only items
    if (isAdmin) {
      baseItems.splice(1, 0, {
        title: "Create User",
        url: "#",
        icon: IconUserPlus,
        onClick: () => onNavigate('createUser')
      })

      baseItems.push({
        title: "Analytics",
        url: "#",
        icon: IconChartBar,
        onClick: () => onNavigate('analytics'),
        badge: "Admin"
      })
    }

    return baseItems
  }

  // Shared features navigation
  const navSharedFeatures = [
    {
      title: "Calendar",
      url: "#",
      icon: IconCalendar,
      onClick: () => onNavigate('calendar'),
      disabled: true
    },
    {
      title: "Templates",
      url: "#",
      icon: IconFileText,
      onClick: () => onNavigate('templates'),
      disabled: true
    },
    {
      title: "Team Chat",
      url: "#",
      icon: IconMessage,
      onClick: () => onNavigate('chat'),
      disabled: true
    },
  ]

  // Secondary navigation
  const navSecondary = [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      onClick: () => onNavigate('settings'),
      disabled: true
    },
    {
      title: "Help",
      url: "#",
      icon: IconHelp,
      onClick: () => onNavigate('help'),
      disabled: true
    },
  ]

  // User data for the sidebar
  const userData = {
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`,
    role: user?.role || 'USER'
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
                <IconMail className="!size-5" />
                <span className="text-base font-semibold">Email Marketing</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <EmailNavMain items={getNavMain()} />
        <NavSharedFeatures items={navSharedFeatures} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <EmailNavUser user={userData} onLogout={logout} />
      </SidebarFooter>
    </Sidebar>
  )
}

// Custom NavSharedFeatures component for shared features
function NavSharedFeatures({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    onClick?: () => void
    disabled?: boolean
  }[]
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
            className={`${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
  )
}