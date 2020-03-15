import assert from '../../assert'
import async from '.'

var last_msg = ''
// log is triggered by the script
// @ts-ignore
window.log = function(msg: string) {
  last_msg = msg
}

describe('async/script', () => {
  it('success', function(done) {
    async('async/script/hello.js', function(err) {
      assert.equal(err, null)
      assert.equal(last_msg, 'Hello world')
      last_msg = ''
      done()
    })
  })

  it('success', function(done) {
    async('async/script/hello.js', function(err) {
      assert.equal(err, null)
      assert.equal(last_msg, 'Hello world')
      last_msg = ''
      const scripts = document.body.querySelectorAll('script')
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].getAttribute('src') === 'async/script/hello.js') {
          done()
          return
        }
      }
      done(new Error('script not found'))
    })
  })

  it('opts.async', function(done) {
    async('async/script/hello.js', { async: false }, function(err, script) {
      assert.equal(err, null)
      assert.equal(script.async, false)
      done()
    })
  })

  it('opts.attrs', function(done) {
    async('async/script/hello.js', { attrs: { foo: 'boo' } }, function(err, script) {
      assert.equal(err, null)
      assert.equal(script.getAttribute('foo'), 'boo')
      done()
    })
  })

  it('opts.charset', function(done) {
    async('async/script/hello.js', { charset: 'iso-8859-1' }, function(err, script) {
      assert.equal(err, null)
      assert.equal(script.charset, 'iso-8859-1')
      done()
    })
  })

  it('opts.text', function(done) {
    async('async/script/hello.js', { text: 'foo=5;' }, function(err, _script) {
      assert.equal(err, null)
      done()
    })
  })

  it('opts.type', function(done) {
    async('async/script/hello.js', { type: 'text/ecmascript' }, function(err, script) {
      assert.equal(err, null)
      assert.equal(script.type, 'text/ecmascript')
      done()
    })
  })

  it('no exist', function(done) {
    async('unexistent.js', function(err, legacy) {
      if (!legacy) {
        assert.ok(err)
      }

      var tid = setTimeout(function() {
        done()
      }, 200)

      // some browsers will also throw as well as report erro
      var old = window.onerror
      window.onerror = function(msg, _file, _line) {
        if (msg !== 'Error asyncing script') {
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
    async('async/script/throw.js', function(err) {
      assert.equal(err, null)
      window.onerror = old
      done()
    })
  })
})
