
var _ = require('lodash');
var webSettings = require('./server/services/webSettings');  // Calls the Web Settings Service and looks for no proxy or test mode or deploy flags

var serverPromise = initializeWebServer();

function initializeWebServer() {

    var express = require('express');
    var bodyParser = require('body-parser');
    var app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    require('./server/middleware/webAuth')(app, webSettings); // Calls Web Auth Service

    if(webSettings.startProxy) {

        var httpProxy = require('http-proxy');
        var proxy = httpProxy.createProxyServer({});

        proxy.on('error', function(err, req, res) {
            console.log(err);
            res.end();
        });

        var authMiddleware = webSettings.testMode ? ignoreAuthentication : app.oauth.authorise();

        app.all(webSettings.contextRoot + "/solr/*", authMiddleware, function (req, res) {
            req.url = req.url.substring(webSettings.contextRoot.length);
            delete req.headers["Authorization"];
            proxy.web(req, res, { target: webSettings.solrAddress});
        });

        function ignoreAuthentication(req, res, next) {
            next();
        }
    }

    require('./server/middleware/virtualWebSettings')(app, webSettings);


    app.use(webSettings.contextRoot + '/api', app.oauth.authorise(), require('./server/api/usersAPI'));
    app.use(webSettings.contextRoot + '/api', app.oauth.authorise(), require('./server/api/currentUserAPI'));
    app.use(webSettings.contextRoot + '/api',app.oauth.authorise(), require('./server/api/maintenanceAPI'));


    var basePath = __dirname;
    var assetsPath = webSettings.useBuild ? "/dist/web" : "/src";
    app.use(webSettings.contextRoot, express.static(basePath + assetsPath));

    app.use(function(req, res) {
        if(req.path === "/") {
            res.send(webSettings.contextRoot);
        }
        else {
            console.log("Path not found: " + req.path);
            res.status(404);
            res.type('txt').send('Not found');
        }
    });

    app.use(function(err, req, res, next) {
        if(!err) {
            return next();
        }

        if(err["name"]==="OAuth2Error"){  // Hotfix for OAuth Session Timeout Issue, we need to fix it properly
            console.log("*****************************************");
            console.log("A user session has expired. The error trace below is expected.");
            console.log("Logging the user out now...");
            res.sendStatus(403);
        }else {
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json');
            res.json({
                error: (err || "").toString()
            });
        }


        console.log("ERROR:", err);
    });

    var server = app.listen(webSettings.portNumber, function () {
        console.log('TaaS Web Application happily running at http://localhost:%s', server.address().port);
    });

    return server;
}

if(module) {
    module.exports = serverPromise;
}
