import raf from '../../internal/raf'
import { h, render } from 'preact'
import assert from '../../assert'
import subscribe from './'
import Proxy from '../'

describe('proxy/preact', () => {
  let root: HTMLElement
  beforeEach(() => {
    const tmp = document.getElementById('proxy/preact')
    if (tmp) {
      tmp.parentNode?.removeChild(tmp)
    }
    root = document.createElement('div')
    root.id = 'proxy/preact'
  })

  it('subscribe(proxy, fn)', done => {
    type State = { message: string }
    const proxy = Proxy<State>({ message: 'hello' })
    const fn = () => h('div', {}, proxy.message)
    render(subscribe(proxy, fn), root)
    assert.equal(root.innerHTML, '<div>hello</div>')
    proxy.message = 'bonjour'
    raf(() => {
      assert.equal(root.innerHTML, '<div>bonjour</div>')
      done()
    })
  })
})
