import raf from '../internal/raf'
import assert from '../assert'
import Proxy from './'

describe('proxy', () => {
  describe('object', () => {
    it('should work with simple objects', done => {
      let called = 0
      const state = Proxy({ a: 'b' })
      state.subscribe(() => called++)
      assert.equal(state.a, 'b')
      state.a = 'a'
      assert.equal(state.a, 'a')
      raf(() => {
        assert.equal(called, 1)
        done()
      })
    })
  })

  describe('array', () => {
    it('should work with simple arrays', done => {
      let called = 0
      const state = Proxy<string[]>([])
      state.subscribe(() => called++)
      state.push('a', 'b')
      assert.equal(state.length, 2)
      assert.equal(state[0], 'a')
      assert.equal(state[1], 'b')
      state.splice(0, 1)
      assert.equal(state.length, 1)
      assert.equal(state[0], 'b')
      raf(() => {
        assert.equal(called, 1)
        done()
      })
    })

    it('should work with arrays of objects', done => {
      let called = 0
      type State = { tabs: { active: boolean }[] }
      const state = Proxy<State>({ tabs: [] })
      state.subscribe(() => called++)
      assert.equal(state.tabs.length, 0)
      state.tabs.push({ active: true })
      assert.equal(state.tabs.length, 1)
      assert.equal(state.tabs[0].active, true)
      const tab = state.tabs.pop()
      assert.equal(state.tabs.length, 0)
      assert.notEqual(tab, undefined)
      assert.equal(tab?.active, true)
      raf(() => {
        assert.equal(called, 1)
        done()
      })
    })

    it('JSON.stringify should return the original object', () => {
      type State = { frames: { type: string }[] }
      const state = Proxy<State>({ frames: [] })
      state.frames.push({ type: 'a' })
      state.frames.push({ type: 'b' })
      state.frames.push({ type: 'c' })
      console.log(JSON.stringify(state.frames))
      assert.ok(true === Array.isArray(JSON.parse(JSON.stringify(state.frames))))
      assert.deepEqual(JSON.parse(JSON.stringify(state.frames)), [{ type: 'a' }, { type: 'b' }, { type: 'c' }])
    })
  })
})
