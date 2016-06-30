# WebpackLicensesPlugin

Adds a file to your webpack build with license information about all your dependencies.

This plugin will fail the build if a dependency has a missing or unacceptable license.

## Usage

```
new WebpackLicensesPlugin(options)
```

## Default Options

```
{
  acceptable: /.*/,
  unacceptable: /unlicensed/i,
  selected: {},
  title: 'Licenses:',
  filename: 'LICENSES.txt',
}
```

This plugin supports text and markdown files (auto-detected from the filename).

## Output

```
Licenses:

d3 licensed under BSD-3-Clause (http://d3js.org)

lodash licensed under MIT (https://lodash.com/)
```
