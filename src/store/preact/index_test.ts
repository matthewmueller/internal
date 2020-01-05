import { h, render } from 'preact'
import assert from '../../assert'

describe('connect', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should render once', () => {
    render(h('div', {}, 'hello world'), document.body)
    assert.ok(true)
  })
})
