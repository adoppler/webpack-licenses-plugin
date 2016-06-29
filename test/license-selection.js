import test from 'ava'

import { validateConfig, selectLicenseForPackage } from '../webpack-licenses-plugin'

const pkgMIT = {
  name: 'pkgMIT',
  license: 'MIT',
}

const pkgMany = {
  name: 'pkgMany',
  licenses: [
    { type: 'MIT' },
    { type: 'MPL' },
  ],
}

const pkgNone = {
  name: 'pkgNone',
}

const pkgInvalid = {
  name: 'pkgInvalid',
  license: 4,
}

test('Default to preselected license', t => {
  const options = {
    selected: {
      pkgNone: 'MIT',
    },
  }
  const license = selectLicenseForPackage(pkgNone, validateConfig(options))
  t.is(license, 'MIT')
})

test('Select from license field by default', t => {
  const options = {}

  const license = selectLicenseForPackage(pkgMIT, validateConfig(options))
  t.is(license, 'MIT')
})

test('Fallback to first license from licenses field', t => {
  const options = {}

  const license = selectLicenseForPackage(pkgMany, validateConfig(options))
  t.is(license, 'MIT')
})

test('Select first acceptable license from licenses field', t => {
  const options = {
    unacceptable: /MIT/,
  }

  const license = selectLicenseForPackage(pkgMany, validateConfig(options))
  t.is(license, 'MPL')
})

test('Throws on missing license', t => {
  t.throws(() => {
    const options = {}
    selectLicenseForPackage(pkgNone, validateConfig(options))
  })
})

test('Throws on invalid license', t => {
  t.throws(() => {
    const options = {}
    selectLicenseForPackage(pkgInvalid, validateConfig(options))
  })
})

test('Throws on unacceptable license', t => {
  t.throws(() => {
    const options = {
      acceptable: /MPL/,
    }

    selectLicenseForPackage(pkgMIT, validateConfig(options))
  })
  t.throws(() => {
    const options = {
      unacceptable: /MIT/,
    }

    selectLicenseForPackage(pkgMIT, validateConfig(options))
  })
})

