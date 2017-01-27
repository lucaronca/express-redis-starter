const
    express = require('express'),
    router = express.Router(),
    passport = require('passport');

router.get('/', (req, res) => {

    // if user is authenticated not allow access to this page
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    res.render('pages/user/login');

});

router.post('/', passport.authenticate('local', {
    successRedirect: '/upload',
    failureRedirect: '/login'
}));

module.exports = router;