import path from 'path'

import test from 'ava'

import WebpackLicensesPlugin from '../webpack-licenses-plugin'

test('Hook into webpack emit event', t => {
  t.plan(4)

  const licensePlugin = new WebpackLicensesPlugin({
    filename: 'LICENSES.txt',
  })

  const compiler = {
    context: path.join(__dirname, 'fixture'),
    plugin(event, handler) {
      t.is(event, 'emit')

      const compilation = {
        assets: {},
      }

      handler(compilation, () => {
        const result = compilation.assets['LICENSES.txt']
        t.true(result.size() > 0)

        const text = result.source()
        t.regex(text, /react licensed under BSD-3-Clause/)
        t.is(text.indexOf('json-schema'), -1)
      })
    },
  }

  licensePlugin.apply(compiler)
})
