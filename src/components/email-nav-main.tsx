import { Link } from "react-router-dom"
import { type Icon } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function EmailNavMain({
  items,
  currentPath,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    disabled?: boolean
    badge?: string
    path?: string
  }[]
  currentPath?: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild={!item.disabled}
                  tooltip={item.title}
                  disabled={item.disabled}
                  className={`${item.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
                    !item.disabled ? 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground' : ''
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-brown-100 to-brown-50 text-brown-900 border-r-2 border-brown-600 font-semibold shadow-sm'
                      : ''
                  }`}
                >
                {item.disabled ? (
                  <>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant={item.badge === 'Admin' ? 'default' : 'secondary'}
                        className={`ml-auto text-xs ${
                          item.badge === 'Admin'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                ) : (
                  <Link to={item.url} className="flex items-center gap-2 w-full">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant={item.badge === 'Admin' ? 'default' : 'secondary'}
                        className={`ml-auto text-xs ${
                          item.badge === 'Admin'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}