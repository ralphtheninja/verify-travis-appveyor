const test = require('tape')
const main = require('..')
const exec = require('child_process').exec

test('travis', t => {
  t.throws(main.travisVersions.bind(null, {
    node_js: {}
  }), /no valid node versions/)
  t.throws(main.travisVersions.bind(null, {}), /no valid node versions/)

  t.same(main.travisVersions({
    node_js: []
  }), [])
  t.same(main.travisVersions({
    node_js: [ '6', '8', '9' ]
  }), [ '6', '8', '9' ])
  t.same(main.travisVersions({
    node_js: [ 6, 8, 9 ]
  }), [ 6, 8, 9 ])

  t.same(main.travisVersions({
    matrix: {
      include: [
        { node_js: '6' },
        { node_js: '8' },
        { node_js: '9' }
      ]
    }
  }), [ '6', '8', '9' ])
  t.same(main.travisVersions({
    matrix: {
      include: [
        { node_js: 6 },
        { node_js: 8 },
        { node_js: 9 }
      ]
    }
  }), [ 6, 8, 9 ])
  t.same(main.travisVersions({
    matrix: {
      include: [
        {},
        { node_js: 8 },
        { node_js: 9 }
      ]
    }
  }), [ 8, 9 ], 'filters out undefined')
  t.same(main.travisVersions({
    matrix: {
      include: [
        { node_js: '6' },
        { node_js: 'stable' },
        { node_js: '8' },
        { node_js: '9' },
        { node_js: 'stable' }
      ]
    }
  }), [ '6', '8', '9' ], 'filters out stable')

  t.end()
})

test('appveyor', t => {
  t.throws(main.appveyorVersions.bind(null, {}), /no valid node versions/)
  t.throws(main.appveyorVersions.bind(null, {
    environment: {}
  }), /no valid node versions/)
  t.throws(main.appveyorVersions.bind(null, {
    environment: {
      matrix: {}
    }
  }), /no valid node versions/)

  t.same(main.appveyorVersions({
    environment: {
      matrix: []
    }
  }), [])
  t.same(main.appveyorVersions({
    environment: {
      matrix: [
        { nodejs_version: '6' },
        { nodejs_version: '8' },
        { nodejs_version: '9' }
      ]
    }
  }), [ '6', '8', '9' ])
  t.same(main.appveyorVersions({
    environment: {
      matrix: [
        { nodejs_version: 6 },
        { nodejs_version: 8 },
        { nodejs_version: 9 }
      ]
    }
  }), [ 6, 8, 9 ])
  t.same(main.appveyorVersions({
    environment: {
      matrix: [
        {},
        { nodejs_version: 8 },
        { nodejs_version: 9 }
      ]
    }
  }), [ 8, 9 ], 'filters out undefined')

  t.end()
})

test('cli', t => {
  t.test('fail', t => {
    const cwd = `${__dirname}/fail`
    exec('../../index.js', { cwd }, (err, stdout, stderr) => {
      t.ok(err, 'should be an error')
      t.equal(stderr.trimRight(), 'travis:["6","9"] and appveyor:["6","8"] are inconsistent')
      t.end()
    })
  })
  t.test('warning', t => {
    const cwd = `${__dirname}/warning`
    exec('../../index.js', { cwd }, (err, stdout, stderr) => {
      t.error(err, 'no error')
      const expected = 'WARNING: version 5 is EOL\n' +
              'WARNING: version 7 is EOL\n'
      t.equal(stdout, expected, 'correct output')
      t.end()
    })
  })
  t.test('success', t => {
    const cwd = `${__dirname}/success`
    exec('../../index.js', { cwd }, (err, stdout, stderr) => {
      t.error(err, 'no error')
      t.end()
    })
  })
})
