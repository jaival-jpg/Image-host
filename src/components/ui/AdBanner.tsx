import React, { useEffect, useRef } from "react"

export function AdBanner() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const writeAd = () => {
      const doc = iframe.contentWindow?.document
      if (!doc) return
      
      doc.open()
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { 
                margin: 0; 
                padding: 0; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                background: transparent; 
                overflow: hidden; 
              }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '0e46d20cd785de217eec5c470c922d16',
                'format' : 'iframe',
                'height' : 50,
                'width' : 320,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/0e46d20cd785de217eec5c470c922d16/invoke.js"></script>
          </body>
        </html>
      `)
      doc.close()
    }

    // Small delay to ensure iframe is fully mounted in the DOM
    const timer = setTimeout(writeAd, 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex justify-center items-center w-full my-4">
      <div className="w-[320px] h-[50px] bg-white/5 rounded overflow-hidden flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white/20 pointer-events-none font-medium tracking-widest uppercase">
          Advertisement
        </div>
        <iframe
          ref={iframeRef}
          title="Advertisement"
          width="320"
          height="50"
          frameBorder="0"
          scrolling="no"
          className="bg-transparent relative z-10"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  )
}
