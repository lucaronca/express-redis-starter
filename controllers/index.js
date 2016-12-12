const
	express = require('express'),
	router = express.Router();

router.use('/', require('./home'));
router.use('/comments', require('./comments'));
router.use('/upload', require('./upload'));

module.exports = router;