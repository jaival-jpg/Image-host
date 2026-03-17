import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Trash2, Copy, CheckCircle2, ExternalLink, Clock } from "lucide-react"
import { Button } from "@/src/components/ui/Button"
import { Card } from "@/src/components/ui/Card"
import { formatDistanceToNow } from "date-fns"

interface HistoryItem {
  id: string
  title: string
  url: string
  url_viewer: string
  time: number
  delete_url: string
}

export function History() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

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

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const deleteItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem("uploadHistory", JSON.stringify(newHistory))
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-8 pb-24"
    >
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">History</h1>
          <p className="text-text-secondary mt-2 font-medium">Your recently hosted images.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary bg-surface/50 px-4 py-2 rounded-full border border-white/5 font-medium">
          <Clock className="w-4 h-4" />
          <span>{history.length}</span>
        </div>
      </div>

      {history.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-white/10 bg-transparent">
          <div className="w-16 h-16 rounded-full bg-surface-light flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No History Yet</h3>
          <p className="text-text-secondary max-w-sm">
            Images you upload will appear here. Start by hosting your first image.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {history.map((item) => (
              <motion.div
                key={item.id}
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 shrink-0 h-10 w-10 rounded-xl"
                        onClick={() => deleteItem(item.id)}
                        title="Remove from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
