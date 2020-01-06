import { h, render } from 'preact'
import assert from '../../assert'
import subscribe from './'
import Store from '../'

describe('store/preact', () => {
  let root: HTMLElement
  beforeEach(() => {
    const tmp = document.getElementById('store/preact')
    if (tmp) {
      tmp.parentNode?.removeChild(tmp)
    }
    root = document.createElement('div')
    root.id = 'store/preact'
  })

  it('subscribe(store, fn)', done => {
    type State = { message: string }
    const store = Store<State>({ message: 'hello' })
    const fn = () => h('div', {}, store.message)
    render(subscribe(store, fn), root)
    assert.equal(root.innerHTML, '<div>hello</div>')
    store.setState({ message: 'bonjour' })
    setTimeout(() => {
      assert.equal(root.innerHTML, '<div>bonjour</div>')
      done()
    }, 0)
  })
})
