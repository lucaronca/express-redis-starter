var express = require('express')
  , router = express.Router()
  , Document = require('../models/document')

router.get('/:id', function(req, res) {
  Document.get(req.params.id, function (err, comment) {
    res.render('comments/comment', {comment: comment})
  })
})

module.exports = router