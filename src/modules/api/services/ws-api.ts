import * as WebSocket from 'ws'
import { CollaborativeJson } from '../../collaboration/collaborative-json'

const wssOptions = { noServer: true }
export const wss = new WebSocket.Server(wssOptions)

const connections: any[] = []

function notify(ws, notification) {
  const message = {
    graphId: notification.id,
    sessionId: notification.metadata,
    delta: notification.delta,
    numSubscribers: notification.numSubscribers,
    updateNumber: notification.updateNumber,
    action: 'updated',
  }
  ws.send(JSON.stringify(message))
}
const collabJson = new CollaborativeJson(notify)

wss.on('connection', (ws) => {
  console.log('ws connection')
  connections.push({
    ws,
    date: new Date(),
  })

  ws.addEventListener('message', event => {
    console.log('ws recieved', event.data)
    const msg = JSON.parse(event.data)
    if (msg.action === 'subscribe') {
      collabJson.add(msg.graphId, msg.graph)
      collabJson.subscribe(msg.graphId, ws)
      const response = {
        action: 'subscribed',
        sessionId: Math.random().toFixed(10).substr(2),
        graph: collabJson.get(msg.graphId),
        numSubscribers: collabJson.entries.get(msg.graphId).subscriptions.size,
      }
      ws.send(JSON.stringify(response))
    }
    if (msg.action === 'update') {
      collabJson.update(msg.graphId, msg.delta, msg.sessionId)
    }
    if (msg.action === 'unsubscribe') {
      collabJson.unsubscribe(ws)
    }
  })

  ws.addEventListener('close', () => {
    collabJson.unsubscribe(ws)
    console.log('conn closed')
  })
})
