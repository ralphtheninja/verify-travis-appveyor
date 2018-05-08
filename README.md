# verify-travis-appveyor

> Ensure node versions on travis and appveyor are consistent.

[![npm](https://img.shields.io/npm/v/verify-travis-appveyor.svg)](https://www.npmjs.com/package/verifi-travis-appveyor)
![Node version](https://img.shields.io/node/v/verify-travis-appveyor.svg)
[![Build Status](https://travis-ci.org/ralphtheninja/verify-travis-appveyor.svg?branch=master)](https://travis-ci.org/ralphtheninja/verify-travis-appveyor)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Useful as a maintenance script to ensure travis and appveyor are using the same node versions. Running it in a `test` or `prepublishOnly` script in your `package.json` will let you know if you have missed anything.

## Install

Add to your `devDependencies` as part of your test and/or release flow:

```
$ npm i verify-travis-appveyor --save-dev
```

Or, install globally for system wide availability:

```
$ npm i verify-travis-appveyor -g
```

## Usage

Run `verify-travis-appveyor` in a project folder containing a `.travis.yml` and a `appveyor.yml`.

Exits with code `0` if they are both consistent.

```
$ verify-travis-appveyor
```

An error message will be printed together with an exit code of `1` if they are inconsistent.

```
$ verify-travis-appveyor
travis:["6","8","9"] and appveyor:["4","6","8"] are inconsistent
```

Additionally outputs a `WARNING` for each node version that have reached End of Life (EOL).

## License

MIT
