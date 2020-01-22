import assert from '../../assert'
import load from './'

var last_msg = ''
// log is triggered by the script
// @ts-ignore
window.log = function(msg: string) {
  last_msg = msg
}

describe('load/script', () => {
  it('success', function(done) {
    load('load/script/hello.js', function(err) {
      assert.equal(err, null)
      assert.equal(last_msg, 'Hello world')
      last_msg = ''
      done()
    })
  })

  it('opts.async', function(done) {
    load('load/script/hello.js', { async: false }, function(err, script) {
      assert.equal(err, null)
      assert.equal(script.async, false)
      done()
    })
  })

  it('opts.attrs', function(done) {
    load('load/script/hello.js', { attrs: { foo: 'boo' } }, function(err, script) {
      assert.equal(err, null)
      assert.equal(script.getAttribute('foo'), 'boo')
      done()
    })
  })

  it('opts.charset', function(done) {
    load('load/script/hello.js', { charset: 'iso-8859-1' }, function(err, script) {
      assert.equal(err, null)
      assert.equal(script.charset, 'iso-8859-1')
      done()
    })
  })

  it('opts.text', function(done) {
    load('load/script/hello.js', { text: 'foo=5;' }, function(err, _script) {
      assert.equal(err, null)
      done()
    })
  })

  it('opts.type', function(done) {
    load('load/script/hello.js', { type: 'text/ecmascript' }, function(err, script) {
      assert.equal(err, null)
      assert.equal(script.type, 'text/ecmascript')
      done()
    })
  })

  it('no exist', function(done) {
    load('unexistent.js', function(err, legacy) {
      if (!legacy) {
        assert.ok(err)
      }

      var tid = setTimeout(function() {
        done()
      }, 200)

      // some browsers will also throw as well as report erro
      var old = window.onerror
      window.onerror = function(msg, _file, _line) {
        if (msg !== 'Error loading script') {
          assert(false)
        }
        window.onerror = old
        clearTimeout(tid)
        done()
      }
    })
  })

  // err is non-null only for network errors,
  // not for bad scripts that throw
  it('throw', function(done) {
    var old = window.onerror
    // silence the script error
    window.onerror = function() {}
    load('load/script/throw.js', function(err) {
      assert.equal(err, null)
      window.onerror = old
      done()
    })
  })
})
