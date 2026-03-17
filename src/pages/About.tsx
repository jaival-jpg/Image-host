import { motion } from "motion/react"
import { Shield, Zap, Image as ImageIcon, Code, Globe2, Server } from "lucide-react"
import { Card } from "@/src/components/ui/Card"
import { AdBanner } from "@/src/components/ui/AdBanner"

export function About() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized global CDN ensures your images load instantly anywhere in the world."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your images are securely hosted. Choose auto-delete options for temporary sharing."
    },
    {
      icon: ImageIcon,
      title: "High Quality",
      description: "We preserve the original quality of your images without aggressive compression."
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Get direct URLs, HTML embed codes, and viewer links instantly after upload."
    },
    {
      icon: Globe2,
      title: "Global Access",
      description: "Share your images across any platform, forum, or website with ease."
    },
    {
      icon: Server,
      title: "Reliable Infrastructure",
      description: "Powered by the robust ImgBB API, ensuring 99.9% uptime for your hosted content."
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-16 pb-24"
    >
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4"
        >
          About ImageHost
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-black tracking-tighter text-white"
        >
          Built for speed.
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-text-secondary font-medium"
        >
          No ads. No tracking. Just pure performance.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AdBanner />
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {features.map((feature, i) => (
          <div key={i} className="p-8 rounded-3xl bg-surface/30 border border-white/5 hover:bg-surface/50 transition-colors duration-300">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-6">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{feature.title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed font-medium">{feature.description}</p>
          </div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl p-12 text-center space-y-4 relative overflow-hidden bg-primary/5 border border-primary/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        
        <h2 className="text-2xl font-bold text-white relative z-10 tracking-tight">Powered by ImgBB API</h2>
        <p className="text-text-secondary max-w-xl mx-auto relative z-10 font-medium text-sm">
          Secure, fast, and reliable infrastructure.
        </p>
      </motion.div>

      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p className="text-text-secondary">
          Developed by <span className="text-white font-semibold">Jaival Pandya</span>
        </p>
      </motion.div>
    </motion.div>
  )
}
