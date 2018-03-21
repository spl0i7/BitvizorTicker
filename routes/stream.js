let express = require('express');
let sseConnections = require('../middlewares/sse').sseConnections;
let router = express.Router();
let database = require('../memorydatabase').create();


/* GET home page. */
router.get('/:country', function(req, res) {

    res.sseSetup();
    res.sseSend(database[req.params.country]);
    let closedRequests = [];
    if(sseConnections[req.params.country].constructor !== Array) {
        return;
    }

    // for(let i = 0; i < sseConnections[req.params.country].length; i++){
    //     if(sseConnections[req.params.country][i].socket.readyState !== 'open'){
    //         sseConnections[req.params.country][i].sseSend({'message': 'hello india'});
    //     }
    //     else {
    //         closedRequests.push(i);
    //     }
    // }
    //
    // for(let i = 0; i < closedRequests.length; i++){
    //     sseConnections[req.params.country].splice(closedRequests[i], 1);
    // }

    sseConnections[req.params.country].push(res);
});


module.exports = router;
