import test from 'ava'

import { generateTextFile } from '../webpack-licenses-plugin'

const licenses = [
  {
    name: 'A',
    license: 'MIT',
    link: 'https://npmjs.com/package/A',
  },
  {
    name: 'B',
    license: 'ISC',
    link: 'https://npmjs.com/package/B',
  },
]

test('Generate Text', t => {
  const expected = `Text Title

A licensed under MIT (https://npmjs.com/package/A)

B licensed under ISC (https://npmjs.com/package/B)
`

  t.is(generateTextFile('Text Title', licenses, 'text'), expected)
})

test('Generate Markdown', t => {
  const expected = `# Markdown Title

[A](https://npmjs.com/package/A) licensed under MIT

[B](https://npmjs.com/package/B) licensed under ISC
`

  t.is(generateTextFile('Markdown Title', licenses, 'markdown'), expected)
})
