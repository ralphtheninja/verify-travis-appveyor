#!/usr/bin/env node

const path = require('path')
const parseYaml = require('read-yaml')
const debug = require('debug')('verify-travis-appveyor')
const unique = require('array-uniq')
const equals = require('array-equal')
const isEOL = require('lts-schedule').isEOL
const cwd = process.cwd()

const travisVersions = obj => {
  var result
  if (Array.isArray(obj.node_js)) {
    result = obj.node_js
  } else if (obj.matrix && Array.isArray(obj.matrix.include)) {
    result = obj.matrix.include
      .map(i => i.node_js)
      .filter(Boolean)
      .filter(i => String(i).toLowerCase() !== 'stable')
  } else {
    throw new Error('no valid node versions')
  }
  return unique(result)
}

const appveyorVersions = obj => {
  var result
  if (obj.environment && Array.isArray(obj.environment.matrix)) {
    result = obj.environment.matrix.map(i => i.nodejs_version).filter(Boolean)
  } else {
    throw new Error('no valid node versions')
  }
  return unique(result)
}

const stringify = arr => {
  return arr.map(i => String(i))
}

if (!module.parent) {
  const exit = err => {
    console.error(err.message || err)
    process.exit(1)
  }
  debug('cwd is', cwd)
  parseYaml(path.join(cwd, '.travis.yml'), (err, travis) => {
    if (err) return exit('invalid or missing .travis.yml')
    debug('travis', JSON.stringify(travis, null, 2))
    parseYaml(path.join(cwd, 'appveyor.yml'), (err, appveyor) => {
      if (err) return exit('invalid or missing appveyor.yml')
      debug('appveyor', JSON.stringify(appveyor, null, 2))
      try {
        const lhs = stringify(travisVersions(travis)).sort()
        const rhs = stringify(appveyorVersions(appveyor)).sort()
        if (!equals(lhs, rhs)) {
          exit(`travis:${JSON.stringify(lhs)} and appveyor:${JSON.stringify(rhs)} are inconsistent`)
        }
        lhs.filter(isEOL).forEach(v => {
          console.log(`WARNING: version ${v} is EOL`)
        })
      } catch (err) {
        exit(err)
      }
    })
  })
}

exports.travisVersions = travisVersions
exports.appveyorVersions = appveyorVersions
