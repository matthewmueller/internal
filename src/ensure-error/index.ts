export default function ensureError(input: any): Error {
  if (!(input instanceof Error)) {
    return new NonError(input)
  }

  const error = input

  if (!error.name) {
    error.name = (error.constructor && error.constructor.name) || "Error"
  }

  if (!error.message) {
    error.message = "<No error message>"
  }

  if (!error.stack) {
    error.stack = (new Error(error.message).stack || "").replace(/\n {4}at /, "\n<Original stack missing>$&")
  }

  return error
}

class NonError extends Error {
  constructor(message: string) {
    super(message || "<No error message>")
    this.name = "NonError"
    this.stack = new Error(message).stack || ""
  }
}
