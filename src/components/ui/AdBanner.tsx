import React from "react"

export function AdBanner() {
  const adCode = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
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
  `

  return (
    <div className="flex justify-center items-center w-full my-6">
      <div className="w-[320px] h-[50px] bg-surface-light/30 rounded overflow-hidden flex items-center justify-center">
        <iframe
          title="Advertisement"
          srcDoc={adCode}
          width="320"
          height="50"
          frameBorder="0"
          scrolling="no"
          className="bg-transparent"
        />
      </div>
    </div>
  )
}
