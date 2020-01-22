import assert from '../assert'
import Deferred from './'

new Promise(function() {})

describe('deferred', () => {
  it('should resolve', async () => {
    const deferred = new Deferred()
    deferred.resolve('ok')
    assert.equal(await deferred, 'ok')
  })

  it('should reject', async () => {
    const deferred = new Deferred()
    const err = new Error('oh noz')
    deferred.reject(err)
    try {
      await deferred
    } catch (e) {
      assert.equal(e, err)
    }
  })

  it('should then', done => {
    const deferred = new Deferred()
    const err = new Error('oh noz')
    deferred.then(e => {
      assert.equal(e, err)
      done()
    })
    deferred.resolve(err)
  })

  it('should catch', done => {
    const deferred = new Deferred()
    const err = new Error('oh noz')
    deferred.catch(e => {
      assert.equal(e, err)
      done()
    })
    deferred.reject(err)
  })

  it('should finally', done => {
    const deferred = new Deferred()
    const err = new Error('oh noz')
    deferred
      .catch(e => {
        assert.equal(e, err)
      })
      .finally(() => {
        done()
      })
    deferred.reject(err)
  })
})
