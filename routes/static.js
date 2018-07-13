let express = require('express');
let router = express.Router();

router.get('/top100', function(req, res, next) {

        return res.render('top100');

});
router.get('/contact', function(req, res, next) {

        return res.render('contact');

});
router.get('/about', function(req, res, next) {

        return res.render('about');

});


module.exports = router;
