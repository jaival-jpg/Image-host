import { useState } from "react"

interface ImgBBResponse {
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

export function useImgBB() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const uploadImage = async (file: File, expiration?: number): Promise<ImgBBResponse['data'] | null> => {
    setIsUploading(true)
    setError(null)
    setProgress(10)

    try {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY
      if (!apiKey) {
        throw new Error("ImgBB API key is missing. Please set VITE_IMGBB_API_KEY in your .env file.")
      }

      const formData = new FormData()
      formData.append("image", file)
      if (expiration) {
        formData.append("expiration", expiration.toString())
      }

      setProgress(40)

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      })

      setProgress(80)

      const data: any = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || data.data?.error?.message || "Failed to upload image")
      }

      setProgress(100)
      
      // Save to local history
      const history = JSON.parse(localStorage.getItem("imagehost_history") || "[]")
      const newEntry = {
        id: data.data.id,
        url: data.data.url,
        viewer: data.data.url_viewer,
        thumb: data.data.thumb.url,
        time: data.data.time,
        delete_url: data.data.delete_url
      }
      localStorage.setItem("imagehost_history", JSON.stringify([newEntry, ...history]))

      return data.data
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      return null
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setProgress(0)
      }, 500)
    }
  }

  return { uploadImage, isUploading, error, progress }
}
