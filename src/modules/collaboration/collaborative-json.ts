import * as jsondiffpatch from 'jsondiffpatch'

export class CollaborativeJson {
  entries
  private diffpatcher
  private notify

  constructor(notify) {
    this.entries = new Map()
    this.diffpatcher = jsondiffpatch.create({})
    this.notify = notify
  }

  add(jsonId, json) {
    const entry = this.entries.get(jsonId)
    if (entry) return false

    const newEntry = {
      data: json,
      numUpdates: 0,
      subscriptions: new Set(),
    }
    this.entries.set(jsonId, newEntry)
    return true
  }

  get(jsonId) {
    const entry = this.entries.get(jsonId)
    if (!entry) return
    return entry.data
  }

  delete(jsonId) {
    this.entries.delete(jsonId)
  }

  subscribe(jsonId, subscription) {
    const entry = this.entries.get(jsonId)
    console.log('subscribe', entry.subscriptions.size)
    entry.subscriptions.add(subscription)
  }

  unsubscribe(subscription) {
    for (const [id, ent] of this.entries) {
      if (!ent.subscriptions.has(subscription)) continue
      ent.subscriptions.delete(subscription)
      if (ent.subscriptions.size !== 0) continue
      this.delete(id)
    }
  }

  update(jsonId, delta, metadata) {
    const entry = this.entries.get(jsonId)
    this.diffpatcher.patch(entry.data, delta)
    entry.numUpdates += 1
    const notification = {
      id: jsonId,
      delta,
      updateNumber: entry.numUpdates,
      metadata,
      numSubscribers: entry.subscriptions.size,
    }
    console.log('delta', delta)
    for (const sub of entry.subscriptions) {
      this.notify(sub, notification)
    }
  }
}
