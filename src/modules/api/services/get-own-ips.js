const os = require('os')

function getOwnIps() {
  const ifs = os.networkInterfaces()
  const subIfs = Object.values(ifs)
    .reduce((acc, subs) => acc.concat(subs), [])
  const ips = subIfs
    .filter(subIf => subIf.family === 'IPv4')
    .map(subIf => subIf.address)
  return ips
}

module.exports = { getOwnIps }
