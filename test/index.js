const express = require('express')
const globby = require('globby')
const path = require('path')
const app = express()

const root = path.join(__dirname, '..')
const glob = 'dist/**/*_test.js'

// load/script test helpers
app.get('/load/script/hello.js', (req, res) => {
  res
    .status(200)
    .type('js')
    .send(`log('Hello world')`)
})
app.get('/load/script/throw.js', (req, res) => {
  res
    .status(200)
    .type('js')
    .send(`throw new Error('Hello error')`)
})

app.get('/', (_req, res) => {
  const tests = globby.sync(glob, { cwd: root }).sort()
  res.send(`
    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
        <!-- keep the head clean for src/head tests -->
        <link href="node_modules/mocha/mocha.css" rel="stylesheet" />
        <script src="node_modules/mocha/mocha.js"></script>

        <!-- A container element for the visual Mocha results -->
        <div id="mocha"></div>

        <!-- Mocha setup and initiation code -->
        <script>
          mocha.setup('bdd')
          window.onload = function() {
            const reporter = mocha.run()
            reporter.once('end', () => {
            })
          }
        </script>

        <!-- The script under test -->
        ${tests.map(s => `<script src="${s}"></script>\n`).join('\n')}
      </body>
    </html>
  `)
})

app.use(express.static(path.join(__dirname, '..')))

app.listen(4888, () => {
  console.log('listening on http://localhost:4888')
})
