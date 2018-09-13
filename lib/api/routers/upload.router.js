const express = require('express')

const router = express.Router()

router.post('/', (request, response) => {
  console.log('upl')
  response.json({ok: true})
})

exports.uploadRouter = router