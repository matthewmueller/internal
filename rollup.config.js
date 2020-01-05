import nodeResolve from '@rollup/plugin-node-resolve'
import sucrase from '@rollup/plugin-sucrase'
import glob from 'globby'
import path from 'path'

const tests = glob.sync([path.join('src', '**', 'index_test.{t,j}s')])
const modules = glob.sync([path.join('src', '**', 'index.{t,j}s')]).filter(isPublic)

function isPublic(m) {
  return !~m.indexOf('internal/')
}

function js(m) {
  const parts = m.split(path.sep)
  const name = parts.pop()
  parts.push(path.basename(name, path.extname(name)) + '.js')
  const rest = parts.slice(1)
  return path.join(...['dist'].concat(rest))
}

function mjs(m) {
  const parts = m.split(path.sep)
  const name = parts.pop()
  parts.push(path.basename(name, path.extname(name)) + '.mjs')
  const rest = parts.slice(1)
  return path.join(...['dist'].concat(rest))
}

const pkg = require('./package.json')
const deps = Object.keys(pkg.dependencies)

export default [
  // commonjs
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
    external: m.concat(deps),
    output: {
      name: path.basename(m, path.extname(m)),
      file: js(m),
      format: 'cjs',
    },
  })),
  // es6
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
    external: m.concat(deps),
    output: {
      name: path.basename(m, path.extname(m)),
      file: mjs(m),
      format: 'es',
    },
  })),
  // tests
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
      file: js(m),
      format: 'iife',
    },
  })),
]
