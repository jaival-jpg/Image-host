import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { Upload, Image as ImageIcon, Activity, HardDrive } from "lucide-react"
import { Button } from "@/src/components/ui/Button"
import { AdBanner } from "@/src/components/ui/AdBanner"

interface HistoryItem {
  id: string
  title: string
  url: string
  url_viewer: string
  time: number
  size: number
  delete_url: string
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function Home() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    const storedHistory = localStorage.getItem("uploadHistory")
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory))
      } catch (e) {
        console.error("Failed to parse history", e)
      }
    }
  }, [])

  const totalImages = history.length
  const todayImages = history.filter(item => {
    const itemDate = new Date(item.time * 1000)
    const today = new Date()
    return itemDate.toDateString() === today.toDateString()
  }).length
  const totalSize = history.reduce((acc, item) => acc + (item.size || 0), 0)

  const stats = [
    { title: "Your Total Uploads", value: totalImages.toString(), icon: ImageIcon, color: "text-blue-400" },
    { title: "Uploaded Today", value: todayImages.toString(), icon: Activity, color: "text-green-400" },
    { title: "Storage Used", value: formatBytes(totalSize), icon: HardDrive, color: "text-primary" },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[70vh] gap-12 pb-24"
    >
      <div className="text-center max-w-3xl mx-auto space-y-6">
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50"
        >
          Share <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-glow">Instantly.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-text-secondary max-w-xl mx-auto font-medium"
        >
          Lightning-fast image hosting. No registration required.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-8"
        >
          <Link to="/host">
            <Button size="lg" className="group relative overflow-hidden rounded-full px-8 py-6">
              <span className="relative z-10 flex items-center gap-3 text-lg font-bold tracking-wide">
                <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                START UPLOADING
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            </Button>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AdBanner />
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-12"
      >
        {stats.map((stat, i) => (
          <div key={i} className="p-8 flex flex-col items-center justify-center text-center gap-3 rounded-3xl bg-surface/30 border border-white/5 hover:bg-surface/50 transition-colors duration-300">
            <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
            <p className="text-4xl font-light text-white tracking-tight">{stat.value}</p>
            <h3 className="text-text-secondary text-xs uppercase tracking-widest font-semibold">{stat.title}</h3>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
