const
	express = require('express'),
	router = express.Router();

router.use('/comments', require('./comments'));
router.use('/upload', require('./upload'));

router.get('/', (req, res) => {
  res.render('pages/home');
})

module.exports = router