"use client"

import { type ComponentType, useEffect, useState } from "react"
import type { Route } from 'next'

import {
  Building2,
  Frame,
  Map,
  PieChart,
  Settings2,
  ShoppingCart,
  SquareTerminal,
  CreditCard,
  Users,
  Package,
  ShoppingBag,
  BarChart3,
  Users2,
  Tag,
  DollarSign,
  Store,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSessionStore } from "@/state/session"
import { DISABLE_CREDIT_BILLING_SYSTEM } from "@/constants"

export type NavItem = {
  title: string
  url: Route
  icon?: ComponentType
}

export type NavMainItem = NavItem & {
  isActive?: boolean
  items?: NavItem[]
}

type Data = {
  user: {
    name: string
    email: string
  }
  teams: {
    id: string
    name: string
    logo: ComponentType
    role: string
  }[]
  navMain: NavMainItem[]
  projects: NavItem[]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { session } = useSessionStore();
  const [formattedTeams, setFormattedTeams] = useState<Data['teams']>([]);

  // Map session teams to the format expected by TeamSwitcher
  useEffect(() => {
    if (session?.teams && session.teams.length > 0) {
      // Map teams from session to the format expected by TeamSwitcher
      const teamData = session.teams.map(team => {
        return {
          id: team.id,
          name: team.name,
          // TODO Get the actual logo when we implement team avatars
          logo: Building2,
          role: team.role.name || "Member",
        };
      });

      setFormattedTeams(teamData);
    }
  }, [session]);

  const data: Data = {
    user: {
      name: session?.user?.firstName || "User",
      email: session?.user?.email || "user@example.com",
    },
    teams: formattedTeams,
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Orders",
        url: "/dashboard/orders" as Route,
        icon: ShoppingBag,
      },
      {
        title: "Products",
        url: "/dashboard/products" as Route,
        icon: Package,
      },
      {
        title: "Inventory",
        url: "/dashboard/inventory" as Route,
        icon: BarChart3,
      },
      {
        title: "Customers",
        url: "/dashboard/customers" as Route,
        icon: Users2,
      },
      {
        title: "Promotions",
        url: "/dashboard/promotions" as Route,
        icon: Tag,
      },
      {
        title: "Pricing",
        url: "/dashboard/pricing" as Route,
        icon: DollarSign,
      },
          {
            title: "Online Store",
            url: "/dashboard/store" as Route,
            icon: Store,
            items: [
              {
                title: "Store Settings",
                url: "/dashboard/store" as Route,
              },
              {
                title: "Theme Builder",
                url: "/dashboard/store/theme-builder" as Route,
              },
            ],
          },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
        items: [
          {
            title: "Profile",
            url: "/settings",
          },
          {
            title: "Security",
            url: "/settings/security",
          },
          {
            title: "Sessions",
            url: "/settings/sessions",
          },
          {
            title: "Change Password",
            url: "/forgot-password",
          },
        ],
      },
    ],
        projects: [
          {
            title: "Analytics",
            url: "/dashboard/analytics" as Route,
            icon: PieChart,
          },
          {
            title: "Media Library",
            url: "/dashboard/media" as Route,
            icon: Frame,
          },
          {
            title: "Shipping Zones",
            url: "/dashboard/shipping" as Route,
            icon: Map,
          },
          {
            title: "Payments",
            url: "/dashboard/payments" as Route,
            icon: CreditCard,
          },
        ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      {data?.teams?.length > 0 && (
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
      )}

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
