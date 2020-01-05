// request next tick, depending on the environment
export default (() => (typeof window === 'undefined' ? (typeof process === 'undefined' ? (fn: () => void) => setTimeout(fn, 0) : process.nextTick) : window.requestAnimationFrame))()
