
module.exports = {
    middleware : function (req, res, next) {

        res.sseSetup = function () {
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });


        };

        res.sseSend = function (data) {
            res.write("data: " + JSON.stringify(data) + "\n\n");
        };

        next();
    },
    sseConnections : {
        IN : [],
        JP : [],
        HK : [],
        KR : [],
        VN : [],
        CA : [],
        SE : [],
        SG : [],
        US : [],
        GB : [],
        MX : [],
        PK : [],
        NG : [],
        CL : [],
        BR : [],
        ZA : [],
        KE : [],
        TH : [],
        RU : [],
        IL : [],
    }
};