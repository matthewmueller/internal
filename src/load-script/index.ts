/**
 * Load the script asynchronously
 */
export default function loadScript(src: string, attrs: Record<string, string> = {}): Promise<HTMLScriptElement> {
  return new Promise(function (resolve, reject) {
    const parent = document.body || document.head || document.documentElement
    const script = document.createElement("script")
    script.type = attrs["type"] || "text/javascript"
    script.src = src

    for (const attr in attrs) {
      if (attr === "async") {
        script.async = attrs["async"] === "true"
        continue
      }
      if (attrs[attr] !== undefined) {
        script.setAttribute(attr, attrs[attr])
      }
    }

    // Add event handlers
    script.onload = function () {
      resolve(script)
    }

    // Add event handlers
    script.onerror = function (_e, _source, _lineno, _colno, error) {
      reject(error || new Error("Failed to load " + this.src))
    }

    // append script
    parent.appendChild(script)
  })
}
