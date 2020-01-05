import nodeResolve from '@rollup/plugin-node-resolve'
import sucrase from '@rollup/plugin-sucrase'
import glob from 'globby'
import path from 'path'

const tests = glob.sync([path.join('src', '**', 'index_test.{t,j}s')])
const modules = glob
  .sync([path.join('src', '**', 'index.{t,j}s')])
  .filter(isPublic)

function isPublic(m) {
  return !~m.indexOf('internal/')
}

function dist(m) {
  const parts = m.split(path.sep)
  const name = parts.pop()
  parts.push(path.basename(name, path.extname(name)) + '.js')
  const rest = parts.slice(1)
  return path.join(...['dist'].concat(rest))
}

export default [
  ...modules.map(m => ({
    input: m,
    plugins: [
      nodeResolve({
        browser: true,
        extensions: ['.js', '.ts'],
        mainFields: ['jsnext', 'module', 'browser', 'main'],
        preferBuiltins: false,
      }),
      sucrase({
        exclude: [path.join('node_modules', '**')],
        transforms: ['typescript'],
      }),
    ],
    external: ['preact'],
    output: {
      name: path.basename(m, path.extname(m)),
      file: dist(m),
      format: 'es',
    },
  })),
  ...tests.map(m => ({
    input: m,
    plugins: [
      nodeResolve({
        browser: true,
        extensions: ['.js', '.ts'],
        mainFields: ['jsnext', 'module', 'browser', 'main'],
        preferBuiltins: false,
      }),
      sucrase({
        exclude: [path.join('node_modules', '**')],
        transforms: ['typescript'],
      }),
    ],
    output: {
      name: path.basename(m, path.extname(m)),
      file: dist(m),
      format: 'iife',
    },
  })),
]
