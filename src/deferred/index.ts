export default class Deferred<T> implements Promise<T> {
  [Symbol.toStringTag]: string

  private readonly promise: Promise<T>
  private res = (_value?: T | PromiseLike<T> | undefined): void => {}
  private rej = (_reason?: any): void => {}

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.res = resolve
      this.rej = reject
    })
  }

  resolve(value: T): void {
    return this.res(value)
  }

  reject(reason: Error): void {
    return this.rej(reason)
  }

  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected)
  }

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T | TResult> {
    return this.promise.catch(onrejected)
  }

  finally(onfinally?: (() => void) | null | undefined): Promise<T> {
    return this.promise.finally(onfinally)
  }
}
