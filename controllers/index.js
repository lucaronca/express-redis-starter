const
	express = require('express'),
	router = express.Router();

router.use('/', require('./home'));
router.use('/comments', require('./comments'));
router.use('/upload', require('./upload'));
router.use('/login', require('./login'));
router.use('/logout', require('./logout'));

module.exports = router;