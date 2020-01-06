import assert from '../assert'
import Store from './'

describe('store', () => {
  it('setState(obj)', done => {
    type State = { n: number }
    const store = Store<State>({ n: 0 })
    store.subscribe(() => {
      assert.deepEqual(store.toJSON(), { n: 1 })
      done()
    })
    store.setState({ n: 1 })
  })

  it('setState(fn)', done => {
    type State = { n: number }
    const store = Store<State>({ n: 0 })
    store.subscribe(() => {
      assert.deepEqual(store.toJSON(), { n: 1 })
      done()
    })
    store.setState(s => ({ n: s.n + 1 }))
  })

  // it('deep set', done => {
  //   type State = { n: { a: string[]; obj: { a: string } } }
  //   const store = Store<State>({ n: { a: [], obj: { a: '' } } })
  //   done()
  //   // store.setState(s => ({ n: s.n + 1 }))
  // })

  it('get(key)', () => {
    type State = { n: number }
    const store = Store<State>({ n: 0 })
    assert.deepEqual(store.n, 0)
  })

  it('get(unknown)', () => {
    type State = { n: number | undefined }
    const store = Store<State>({ n: undefined })
    assert.deepEqual(store.n, undefined)
    store.setState({ n: 1 })
    assert.deepEqual(store.n, 1)
  })
})
