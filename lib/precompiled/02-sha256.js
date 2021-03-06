const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../exceptions.js').ERROR
const assert = require('assert')

module.exports = function (opts) {
  assert(opts.data)

  var results = {}
  var data = opts.data

  results.gasUsed = new BN(opts._common.param('gasPrices', 'sha256'))
  results.gasUsed.iadd(new BN(opts._common.param('gasPrices', 'sha256Word')).imuln(Math.ceil(data.length / 32)))

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0)
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    return results
  }

  results.return = utils.sha256(data)
  results.exception = 1

  return results
}
