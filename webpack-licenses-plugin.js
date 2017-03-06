'use strict';
const path = require('path')

function validateConfig(conf) {
  return Object.assign({
    acceptable: /.*/,
    unacceptable: /unlicensed/i,
    selected: {},
    title: 'Licenses:',
    filename: 'LICENSES.txt',
  }, conf)
}

function canUseLicense(license, options) {
  return license && license.match(options.acceptable) && !license.match(options.unacceptable)
}

function selectLicenseForPackage(info, options) {
  let license

  if (options.selected && options.selected[info.name]) {
    license = options.selected[info.name]
  } else if (!info.license && info.licenses) {
    const l = info.licenses.find(t => canUseLicense(t.type, options))
    license = l ? l.type : null
  } else {
    license = info.license
  }

  if (typeof license !== 'string') {
    throw new Error(`Missing or unrecognized license for ${info.name}\n`)
  } else if (!canUseLicense(license, options)) {
    throw new Error(`Forbidden license [${license}] for ${info.name}\n`)
  }

  return license
}

function generateTextFile(title, licenses, extension) {
  let header
  let list

  if (extension === 'markdown' || extension === 'md' || extension === 'mdown') {
    header = `# ${title}`
    list = licenses.map(l => `[${l.name}](${l.link}) licensed under ${l.license}`)
  } else {
    header = title
    list = licenses.map(l => `${l.name} licensed under ${l.license} (${l.link})`)
  }

  return `${[header].concat(list).join('\n\n')}\n`
}


function WebpackLicensesPlugin(conf) {
  this.options = validateConfig(conf)
}

WebpackLicensesPlugin.prototype.apply = function apply(compiler) {
  /* eslint global-require: 0 */
  const vendors = require(path.join(compiler.context, 'package.json')).dependencies

  const licenses = Object.keys(vendors).map(name => {
    const info = require(path.join(compiler.context, 'node_modules', name, 'package.json'))
    const license = selectLicenseForPackage(info, this.options)
    const link = info.homepage || (info.repository && info.repository.url)

    return { name, license, link: link || `https://www.npmjs.com/package/${name}` }
  })

  compiler.plugin('emit', (compilation, cb) => {
    const result = generateTextFile(this.options.title, licenses, this.options.filename)

    compilation.assets[this.options.filename] = { /* eslint no-param-reassign: 0 */
      source: () => result,
      size: () => result.length,
    }

    cb()
  })
}

if (process.env.NODE_ENV === 'test') {
  WebpackLicensesPlugin.selectLicenseForPackage = selectLicenseForPackage
  WebpackLicensesPlugin.generateTextFile = generateTextFile
  WebpackLicensesPlugin.validateConfig = validateConfig
}

module.exports = WebpackLicensesPlugin

