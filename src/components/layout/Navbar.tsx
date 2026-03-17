import { Link, useLocation } from "react-router-dom"
import { motion } from "motion/react"
import { Image as ImageIcon, Home, Clock, Info } from "lucide-react"
import { cn } from "@/src/lib/utils"

export function Navbar() {
  const location = useLocation()

  const links = [
    { name: "Home", path: "/", icon: Home },
    { name: "History", path: "/history", icon: Clock },
    { name: "About", path: "/about", icon: Info },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-5xl glass-panel rounded-2xl px-6 py-3 flex items-center justify-between"
      >
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">ImageHost</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors",
                  isActive ? "text-primary" : "text-text-secondary hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </span>
              </Link>
            )
          })}
        </div>
      </motion.nav>
    </header>
  )
}
