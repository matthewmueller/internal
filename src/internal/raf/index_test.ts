import assert from '../../assert'
import raf from './'

describe('raf', () => {
  it('should work', () => {
    let i = 0
    raf(() => {
      assert.equal(i, 3)
    })
    i++
    i++
    i++
  })
})
