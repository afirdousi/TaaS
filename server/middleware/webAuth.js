
module.exports = function(app, webSettings) {

    var oauthserver = require('oauth2-server');
    var appUserHelper = require('../services/appUserHelper');
    var ldapLookup;

    //console.log("WEB AUTH.js : Is in test mode " + webSettings.testMode);

    var model = webSettings.testMode ?
        require('../services/testModeUserModel')(webSettings) :
        require('../services/ldapUserModel')(webSettings);

    app.oauth = oauthserver({
        model: model,
        grants: ['password'],
        debug: false
    });
    app.all(webSettings.contextRoot + '/oauth/token', app.oauth.grant());

    if(webSettings.testMode) {

        //console.log("WEB AUTH.js in TEST MODE");
        app.use(webSettings.contextRoot + "/api/is-server-in-test-mode", function(req, res) {
            res.json({
                isTestMode: true
            });
        });

        app.get(webSettings.contextRoot + "/auth/user", app.oauth.authorise(), function(req, res) {

            //console.log("WEB AUTH.js in /auth/user");

            res.json([
                {'Name': 'Some User', 'Id': 'SomeUserId'},
                {'Name': 'Some Other User', 'Id': 'SomeOtherUserId'},
                {'Name': 'Yet Another User', 'Id': 'YetAnotherUserId'}
            ]);
        });

    }
    else {

        ldapLookup = require('../services/ldapLookup')(webSettings);


        //  Used By Admin Panel User Screens

       /* app.get(webSettings.contextRoot + "/auth/user", app.oauth.authorise(), function(req, res, next) {

            var appUser = appUserHelper(req);
            if (!appUser.isInAdminRole) {
                res.sendStatus(403);
            }
            else {
                ldapLookup
                    .searchUsers(req.query.LDAPName)
                    .then(function (result) {
                        res.json(result);
                    })
                    .catch(function (err) {
                        next(err);
                    });
            }
        });*/

    }

};
