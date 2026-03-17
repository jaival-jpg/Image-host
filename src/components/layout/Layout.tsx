import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { BottomNav } from "./BottomNav"

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden pb-24 md:pb-0">
      <Navbar />
      <main className="pt-24 md:pt-32 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
