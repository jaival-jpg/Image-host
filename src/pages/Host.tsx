import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Upload, X, Copy, CheckCircle2, Loader2, Link as LinkIcon, Code, Globe } from "lucide-react"
import { Button } from "@/src/components/ui/Button"
import { Card } from "@/src/components/ui/Card"
import { AdBanner } from "@/src/components/ui/AdBanner"
import { cn } from "@/src/lib/utils"

const compressImage = async (file: File, maxWidth = 1920, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve(file)
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          file.type,
          quality
        )
      }
      img.onerror = (error) => reject(error)
    }
    reader.onerror = (error) => reject(error)
  })
}

interface UploadResponse {
  data: {
    id: string
    title: string
    url_viewer: string
    url: string
    display_url: string
    width: number
    height: number
    size: number
    time: number
    expiration: number
    image: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    thumb: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    delete_url: string
  }
  success: boolean
  status: number
}

export function Host() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [expiration, setExpiration] = useState<string>("0")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      handleFileSelect(droppedFile)
    }
  }, [])

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)
    setProgress(5)
    
    try {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY || "736e7059c3bed562d59f1936c7740a00"
      if (!apiKey) {
        throw new Error("ImgBB API Key is missing.")
      }

      // Compress image if it's large (e.g., > 1MB)
      let fileToUpload = file
      if (file.size > 1024 * 1024) {
        setProgress(10)
        fileToUpload = await compressImage(file)
      }

      setProgress(15)

      const formData = new FormData()
      formData.append("image", fileToUpload)
      
      if (expiration !== "0") {
        const hours = parseInt(expiration)
        formData.append("expiration", (hours * 3600).toString())
      }

      // Use XMLHttpRequest for real upload progress
      const result = await new Promise<UploadResponse>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            // Map 0-100% of upload to 15-90% of total progress
            const uploadProgress = Math.round((event.loaded / event.total) * 100)
            setProgress(15 + Math.round(uploadProgress * 0.75))
          }
        })

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText)
              if (response.success) {
                resolve(response)
              } else {
                reject(new Error(response.error?.message || "Upload failed"))
              }
            } catch (e) {
              reject(new Error("Invalid response from server"))
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        })

        xhr.addEventListener("error", () => {
          reject(new Error("Network error occurred during upload"))
        })

        xhr.open("POST", `https://api.imgbb.com/1/upload?key=${apiKey}`)
        xhr.send(formData)
      })

      setProgress(100)
      setUploadResult(result)
      
      // Save to local storage history
      const history = JSON.parse(localStorage.getItem("uploadHistory") || "[]")
      localStorage.setItem("uploadHistory", JSON.stringify([result.data, ...history]))
      
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setProgress(0)
      }, 500)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedLink(type)
      setTimeout(() => setCopiedLink(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setPreview(null)
    setUploadResult(null)
    setCopiedLink(null)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto space-y-12 pb-20 pt-8"
    >
      <div className="space-y-8">
        <AdBanner />
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Upload Image</h1>
          <p className="text-text-secondary text-lg">Drag and drop anywhere to upload.</p>
        </div>

        <AnimatePresence mode="wait">
          {!uploadResult ? (
            <motion.div
              key="upload-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <Card
                className={cn(
                  "relative overflow-hidden transition-all duration-500 rounded-3xl border-2 border-dashed",
                  isDragging 
                    ? "border-primary bg-primary/5 scale-[1.02] shadow-[0_0_40px_rgba(255,212,0,0.15)]" 
                    : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  disabled={isUploading}
                />
                
                <div className="p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
                  {preview ? (
                    <div className="relative w-full max-w-md mx-auto aspect-video rounded-xl overflow-hidden bg-black/50">
                      <img src={preview} alt="Preview" className={cn("w-full h-full object-contain transition-opacity", isUploading && "opacity-50")} />
                      {!isUploading && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setFile(null)
                            setPreview(null)
                          }}
                          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-20"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-30">
                          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                          <div className="text-primary font-medium bg-black/50 px-3 py-1 rounded-full">Uploading... {progress}%</div>
                          <div className="w-48 h-2 bg-surface rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-primary to-primary-glow"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-text-secondary bg-black/50 px-2 py-1 rounded-full flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> {progress < 15 ? "Compressing image..." : progress >= 90 ? "Processing..." : "Uploading..."}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6 flex flex-col items-center pointer-events-none">
                      <div className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500",
                        isDragging ? "bg-primary/20 scale-110" : "bg-surface-light border border-white/5"
                      )}>
                        <Upload className={cn(
                          "w-8 h-8 transition-colors duration-500",
                          isDragging ? "text-primary" : "text-text-secondary"
                        )} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-semibold tracking-tight">
                          {isDragging ? "Drop to upload" : "Select an image"}
                        </h3>
                        <p className="text-sm text-text-secondary font-medium tracking-wide uppercase">PNG, JPG, WEBP up to 32MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <AdBanner />

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <div className="w-full sm:w-auto flex-1">
                  <select
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                    disabled={isUploading}
                    className="w-full bg-surface/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent appearance-none font-medium transition-all hover:bg-surface"
                  >
                    <option value="0">Keep Forever</option>
                    <option value="1">Delete after 1 hour</option>
                    <option value="6">Delete after 6 hours</option>
                    <option value="12">Delete after 12 hours</option>
                    <option value="24">Delete after 1 day</option>
                    <option value="168">Delete after 7 days</option>
                  </select>
                </div>
                
                <div className="w-full sm:w-auto flex-1 sm:flex-none">
                  <Button
                    size="lg"
                    className="w-full rounded-2xl px-8 py-4 font-bold tracking-wide"
                    disabled={!file || isUploading}
                    onClick={handleUpload}
                  >
                    {isUploading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        UPLOADING
                      </span>
                    ) : (
                      "UPLOAD NOW"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload-success"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Upload Complete</h3>
                <p className="text-text-secondary">Your image is ready to be shared with the world.</p>
              </div>

              <Card className="p-8 space-y-8 rounded-3xl border-white/5 bg-surface/30">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/50 border border-white/10 group">
                  <img src={uploadResult.data.url} alt="Uploaded" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                </div>

                <div className="space-y-5">
                  {[
                    { label: "Viewer Link", value: uploadResult.data.url_viewer, icon: Globe },
                    { label: "Direct URL", value: uploadResult.data.url, icon: LinkIcon },
                    { label: "HTML Embed", value: `<a href="${uploadResult.data.url_viewer}"><img src="${uploadResult.data.url}" alt="${uploadResult.data.title}" border="0"></a>`, icon: Code },
                  ].map((link, i) => (
                    <div key={i} className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-secondary ml-1">
                        <link.icon className="w-3 h-3" />
                        {link.label}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={link.value}
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none font-mono text-sm transition-colors hover:border-white/20"
                        />
                        <Button
                          variant="glass"
                          size="icon"
                          onClick={() => copyToClipboard(link.value, link.label)}
                          className="shrink-0 h-[50px] w-[50px] rounded-xl"
                        >
                          {copiedLink === link.label ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={resetUpload} className="rounded-full px-8 py-6 font-semibold tracking-wide">
                  UPLOAD ANOTHER
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
