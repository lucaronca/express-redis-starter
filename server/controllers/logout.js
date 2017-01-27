const
    express = require('express'),
    router = express.Router(),
    passport = require('passport');

router.get('/', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;