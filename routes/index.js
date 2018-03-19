let express = require('express');
let router = express.Router();
let sseConnections = require('../middlewares/sse').sseConnections;


/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({
        success : true
    });
});


module.exports = router;
