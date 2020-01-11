import assert from '../assert'
import maybe from './'

describe('maybe', () => {
  it('should catch rejections', async () => {
    const result = await maybe(
      new Promise<string>((_resolve, reject) => reject(new Error('oh noz')))
    )
    assert(result instanceof Error)
    assert.equal((result as Error).message, 'oh noz')
  })

  it('should return the result', async () => {
    const result = await maybe(
      new Promise<string>((resolve, _reject) => resolve('hi'))
    )
    assert(typeof result === 'string')
    assert.equal(result, 'hi')
  })

  it('should work with non-error rejections', async () => {
    const result = await maybe(
      new Promise<string>((_resolve, reject) => reject('oh noz'))
    )
    assert(result instanceof Error)
    assert.equal((result as Error).message, 'oh noz')
  })
})
