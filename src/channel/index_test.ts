import Deferred from '../deferred'
import assert from '../assert'
import Channel from './'

describe('channel', function() {
  it('should support recv() after close()', async () => {
    const ch = new Channel()
    ;(async () => {
      await ch.send('hello')
      await ch.send('world')
      ch.close()
    })()
    const a = await ch.recv()
    assert.equal(a, 'hello')
    const b = await ch.recv()
    assert.equal(b, 'world')
  })

  it('should error on send() after close()', async () => {
    const ch = new Channel()
    ch.close()
    try {
      await ch.send('hello')
    } catch (err) {
      assert.equal(err.message, 'send on closed channel')
    }
  })

  it('should recv() undefined after close()', async () => {
    const ch = new Channel()
    ;(async () => {
      try {
        await ch.send('hello')
      } catch (err) {
        assert.equal(err.message, 'send on closed channel')
      }
    })()
    ch.close()
    const a = await ch.recv()
    assert(a === undefined)
    const b = await ch.recv()
    assert(b === undefined)
  })

  it('should unblock recv()s on close()', async function() {
    const ch = new Channel<string>()
    const vals: (string | void)[] = []

    const a = (async function() {
      const v = await ch.recv()
      vals.push(v)
    })()

    const b = (async function() {
      const v = await ch.recv()
      vals.push(v)
    })()

    const c = (async function() {
      const v = await ch.recv()
      vals.push(v)
    })()

    await ch.send('hello')
    ch.close()

    const v = await ch.recv()
    assert(v === undefined)

    await Promise.all([a, b, c])
    assert.deepEqual(vals, ['hello', undefined, undefined])
  })

  describe('unbuffered', function() {
    it('should support send() first', async function() {
      const ch = new Channel()
      ;(async () => {
        await ch.send('hello')
      })()
      const v = await ch.recv()
      assert.equal(v, 'hello')
    })

    it('should support recv() first', async function() {
      const ch = new Channel()

      const p = async () => {
        const v = await ch.recv()
        assert.equal(v, 'hello')
      }
      ;(async () => {
        await ch.send('hello')
      })()

      await p
    })
  })

  describe('buffered', function() {
    it('should block send() when the buffer is full', async function() {
      const ch = new Channel<string>(5)
      const vals: (string | void)[] = []
      const def = new Deferred<void>()
      ;(async () => {
        await ch.send('h')
        await ch.send('e')
        await ch.send('l')
        await ch.send('l')
        await ch.send('o')
        def.resolve()
        await ch.send('!')
        ch.close()
      })()

      await def

      for (var i = 0; i < 5; i++) {
        vals.push(await ch.recv())
      }

      assert.deepEqual(vals, ['h', 'e', 'l', 'l', 'o'])
      assert.equal(await ch.recv(), '!')
      assert.equal(await ch.recv(), undefined)
    })
  })
})
