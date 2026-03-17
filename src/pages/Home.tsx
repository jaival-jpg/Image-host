import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Link } from "react-router-dom"
import { Upload, Image as ImageIcon, Activity, Zap, Copy, CheckCircle2, ExternalLink } from "lucide-react"
import { Button } from "@/src/components/ui/Button"
import { Card } from "@/src/components/ui/Card"
import { AdBanner } from "@/src/components/ui/AdBanner"
import { formatDistanceToNow } from "date-fns"

interface HistoryItem {
  id: string
  title: string
  url: string
  url_viewer: string
  time: number
  delete_url: string
}

export function Home() {
  const [recentImages, setRecentImages] = useState<HistoryItem[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const storedHistory = localStorage.getItem("uploadHistory")
    if (storedHistory) {
      try {
        const history = JSON.parse(storedHistory)
        setRecentImages(history.slice(0, 6)) // Show top 6
      } catch (e) {
        console.error("Failed to parse history", e)
      }
    }
  }, [])

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const stats = [
    { title: "Total Images Hosted", value: "1.2M+", icon: ImageIcon, color: "text-blue-400" },
    { title: "Images Hosted Today", value: "4,521", icon: Activity, color: "text-green-400" },
    { title: "Server Speed", value: "99.9%", icon: Zap, color: "text-primary" },
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

      {recentImages.length > 0 && (
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-5xl mt-16 space-y-8"
        >
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-white">Recent Uploads</h2>
            <Link to="/history" className="text-primary hover:text-primary-glow text-sm font-medium transition-colors">
              View All History
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {recentImages.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden group flex flex-col h-full rounded-3xl border-white/5 bg-surface/30 hover:bg-surface/50 transition-colors duration-300">
                    <div className="relative aspect-video bg-black/50 overflow-hidden">
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <a 
                          href={item.url_viewer} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-white hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Original
                        </a>
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <h4 className="font-semibold truncate text-white" title={item.title || "Untitled Image"}>
                          {item.title || "Untitled Image"}
                        </h4>
                        <p className="text-xs text-text-secondary mt-1 font-medium">
                          {formatDistanceToNow(item.time * 1000, { addSuffix: true })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                        <Button 
                          variant="glass" 
                          size="sm" 
                          className="flex-1 text-xs rounded-xl h-10"
                          onClick={() => copyToClipboard(item.url, item.id)}
                        >
                          {copiedId === item.id ? (
                            <span className="flex items-center gap-1 text-green-400 font-bold">
                              <CheckCircle2 className="w-4 h-4" /> COPIED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 font-bold tracking-wide">
                              <Copy className="w-4 h-4" /> COPY URL
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
