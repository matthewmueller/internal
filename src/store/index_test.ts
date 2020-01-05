import assert from '../assert'
import Store from './'

describe('store', () => {
  it('setState(obj)', done => {
    const store = new Store<{ n: number }>({ n: 0 })
    store.subscribe(() => {
      assert.deepEqual(store.state, { n: 1 })
      done()
    })
    store.set({ n: 1 })
  })

  it('setState(fn)', done => {
    const store = new Store<{ n: number }>({ n: 0 })
    store.subscribe(() => {
      assert.deepEqual(store.state, { n: 1 })
      done()
    })
    store.set(s => ({ n: s.n + 1 }))
  })

  it('get(key)', () => {
    const store = new Store<{ n: number }>({ n: 0 })
    assert.deepEqual(store.get('n'), 0)
  })
})
