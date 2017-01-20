const
    express = require('express'),
    router = express.Router(),
    passport = require('passport');

router.get('/', (req, res) => {
    res.render('pages/user/login')
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/upload',
    failureRedirect: '/login'
}));

module.exports = router;