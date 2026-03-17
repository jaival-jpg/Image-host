import { Link, useLocation } from "react-router-dom"
import { motion } from "motion/react"
import { Home, Clock, Info, Upload } from "lucide-react"
import { cn } from "@/src/lib/utils"

export function BottomNav() {
  const location = useLocation()

  const links = [
    { name: "Home", path: "/", icon: Home },
    { name: "Upload", path: "/host", icon: Upload, isPrimary: true },
    { name: "History", path: "/history", icon: Clock },
    { name: "About", path: "/about", icon: Info },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-6 pt-4 px-4 bg-gradient-to-t from-background via-background/90 to-transparent">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full glass-panel rounded-2xl p-2 flex items-center justify-around"
      >
        {links.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors",
                isActive ? "text-primary" : "text-text-secondary hover:text-white",
                link.isPrimary && "w-14 h-14 bg-gradient-to-br from-primary to-primary-glow text-black shadow-[0_0_15px_rgba(255,212,0,0.3)] -translate-y-4 rounded-full border-4 border-background"
              )}
            >
              {isActive && !link.isPrimary && (
                <motion.div
                  layoutId="bottomnav-active"
                  className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex flex-col items-center gap-1">
                <link.icon className={cn("w-5 h-5", link.isPrimary && "w-6 h-6")} />
                {!link.isPrimary && <span className="text-[10px] font-medium">{link.name}</span>}
              </span>
            </Link>
          )
        })}
      </motion.nav>
    </div>
  )
}
