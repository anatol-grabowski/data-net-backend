import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import { requestLoggerMiddleware, responseLoggerMiddleware } from '../middleware/logger.middleware'
import { errorHandlerMiddleware } from '../middleware/error-handler.middleware'

export class HttpApiService {
  private app?: express.Application

  constructor(
    private readonly config,
    private readonly usedEndpoints: express.Router[],
  ) {
    this.createApp(this.usedEndpoints)
  }

  get handler(): express.Application {
    if (!this.app) throw Error('handler not created')
    return this.app
  }

  private createApp(usedEndpoints: express.Router[]) {
    const app = express()
    app.use(responseLoggerMiddleware)
    app.use(cors())
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(requestLoggerMiddleware)

    for (const usedEp of usedEndpoints) {
      app.use(usedEp)
    }

    app.use(errorHandlerMiddleware)
    this.app = app
  }

  async listen() {
    if (!this.config.apiPort) throw Error('apiPort is not specified')
    const port = this.config.apiPort
    return new Promise((resolve, reject) => {
      if (!this.app) throw Error('app not created')
      this.app.listen(port, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}
