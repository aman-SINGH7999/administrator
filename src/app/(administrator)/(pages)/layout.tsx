import { AppHeader } from '@/components/AppHeader'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <main className="flex-1 flex flex-col overflow-auto">
        {children}
      </main>
   
  )
}