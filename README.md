# verify-travis-appveyor

> Ensure node versions on travis and appveyor are consistent.

![Node version](https://img.shields.io/node/v/verify-travis-appveyor.svg)
[![Build Status](https://travis-ci.org/ralphtheninja/verify-travis-appveyor.svg?branch=master)](https://travis-ci.org/ralphtheninja/verify-travis-appveyor)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Useful as a maintenance script to ensure travis and appveyor are using the same node versions. Running it in a `prepublish` script in your `package.json` will let you know if you have missed anything.

## Install

```
$ npm i verify-travis-appveyor -S
```

## Usage

Run `verify-travis-appveyor` in a project folder containing a `.travis.yml` and a `appveyor.yml`.

If they both contain the same node versions, `OK!` will be printed together with an exit code of `0`.

```
$ verify-travis-appveyor
OK!
```

If travis and appveyor are inconsistent an error message will be printed together with an exit code of `1`. E.g.

```
$ verify-travis-appveyor
travis:["6","8","9"] and appveyor:["4","6","8"] are inconsistent
```

## License

MIT
