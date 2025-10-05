import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col overflow-auto">
        <SidebarTrigger className={`absolute w-16 h-10 top-4 left-[--sidebar-width] md:left-[--sidebar-width] z-50 rounded-l-[0px]`}/>
        {children}
      </main>
    </SidebarProvider>
  )
}