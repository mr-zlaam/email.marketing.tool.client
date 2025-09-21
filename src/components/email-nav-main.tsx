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
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    onClick?: () => void
    disabled?: boolean
    badge?: string
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={item.onClick}
                disabled={item.disabled}
                className={`${item.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${!item.disabled ? 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground' : ''}`}
              >
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
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}