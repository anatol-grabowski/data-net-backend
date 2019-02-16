const { mongo } = require('../../db/mongo')
const asyncHandler = require('express-async-handler')
const express = require('express')

const router = express.Router()
router.post('/:name', asyncHandler(async (req, res) => {
  const name = decodeURIComponent(req.params.name)
  await saveUser(name, req.body.graph)
  res.json({saved: true})
}))

async function saveUser(username, password) {
  const doc = {
    username,
    password,
  }
  await mongo.db.collection('users').createOne(doc)
}

exports.userRouter = router