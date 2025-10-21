import { AppSidebar } from "@/components/app-sidebar"
import { getSessionFromCookie } from "@/utils/auth"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionFromCookie()

  if (!session) {
    return redirect('/')
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center">
            <div className="flex-1" />
          </div>
          <div className="flex-1 space-y-4">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
