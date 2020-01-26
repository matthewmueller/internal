/**
 * Options
 */

type Options = {
  min?: number
  max?: number
  jitter?: number
  factor?: number
  retries?: number
}

/**
 * Initialize backoff timer with `opts`.
 */

export default class Backoff {
  private readonly ms: number
  private readonly max: number
  private readonly factor: number
  private readonly jitter: number
  private readonly retries: number
  private attempts: number

  constructor(opts?: Options) {
    opts = opts || {}
    this.ms = opts.min || 100
    this.max = opts.max || 10000
    this.factor = opts.factor || 2
    this.jitter = opts.jitter && opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0
    this.retries = opts.retries || 8
    this.attempts = 0
  }

  duration(): number {
    var ms = this.ms * Math.pow(this.factor, this.attempts++)
    if (this.jitter) {
      var rand = Math.random()
      var deviation = Math.floor(rand * this.jitter * ms)
      ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation
    }
    return Math.min(ms, this.max) | 0
  }

  stop(): boolean {
    return this.attempts >= this.retries
  }

  reset(): void {
    this.attempts = 0
  }
}
