import * as http from 'http'
import { HttpApiService } from './http-api.service'
import { wss as wsServer } from './ws-api'
import { getOwnIps } from './get-own-ips'

const port = process.env.PORT || 8080

export class ServerService {
  async listen(config, routers) {

    const server = http.createServer()

    server.on('upgrade', (request, socket, head) => {
      console.log('upgrade to ws')
      wsServer.handleUpgrade(request, socket, head, (ws) => {
        wsServer.emit('connection', ws, request)
      })
    })

    const httpServer = new HttpApiService(config, routers)
    server.on('request', httpServer.handler)


    if (!config.apiPort) throw Error('apiPort is not specified')
    const port = config.apiPort
    return new Promise((resolve, reject) => {
      const listenCb = err => {
        if (err) return reject(err)
        const ownIps = getOwnIps()
        const lines = ownIps
          .map(ip => `  http://${ip}:${port}/\t\tws://${ip}:${port}/`)
        const msg = `Server is available at:\n${lines.join('\n')}`
        console.log(msg)
        resolve()
      }
      server.listen(port, listenCb as () => void)
    })
  }
}
