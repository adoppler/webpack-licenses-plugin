# WebpackLicensesPlugin

Adds a file to your webpack build with license information about all your dependencies.

This plugin will fail the build if a dependency has a missing or unacceptable license.

## Usage

```
new WebpackLicensesPlugin(options)
```

## Options

```
{
  acceptable: /.*/,
  unacceptable: /unlicensed/i,
  selected: {},
  title: 'Licenses',
  filename: 'LICENSES.txt',
}
```

## Output

```
# Licenses

[d3](http://d3js.org) licensed under BSD-3-Clause

[lodash](https://lodash.com/) licensed under MIT
```
