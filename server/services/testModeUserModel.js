
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var testUserFileName = ('../../__TestUser__.json');

module.exports = function(webSettings) {

    //console.log("TEST MODE USER MODEL.js");
    //console.log("Web Setting:");
    //console.log(webSettings);
    //console.log("Authorized Clients");
    //console.log(webSettings.authentication.authorizedClients[0]);

    var secretKey = webSettings.authentication.secretKey;
    var authorizedClients = _.map(webSettings.authentication.authorizedClients, function(client) {
        return {
            clientId: client.id,
            clientSecret: client.secret,
            grantTypes: ['password']
        };
    });

    initializeTestUserFile(function(err) {
        if(err) {
            //console.log("Error writing user file.");
            //console.log(err);
        }
    });

    var model = {

        getAccessToken: function (bearerToken, callback) {
            //console.log("TEST MODE USER MODEL: in getAccessToken()");

            var options = {
                algorithms: ['HS512']
            };
            jwt.verify(bearerToken, secretKey, options, function (err, decoded) {

                //console.log("TEST MODE USER MODEL: in getAccessToken() calling jwt.verify()");


                if (err) {
                    //console.log("ST MODE USER MODEL: in jwt.verify : ERROR");
                    callback(err);
                }
                var user = {
                    userId: decoded.userId,
                    userName: decoded.userName,
                    clientId: decoded.clientId,
                    roles: decoded.roles
                };
                var token = {
                    accessToken: bearerToken,
                    clientId: decoded.clientId,
                    user: user,
                    expires: new Date(decoded.exp * 1000)
                };
                callback(null, token);
            });
        },

        getClient: function (clientId, clientSecret, callback) {
            var data = _.find(authorizedClients, function (d) {
                return d.clientId === clientId && d.clientSecret === clientSecret;
            });
            if (data) {
                callback(null, data);
            }
            else {
                callback(new Error('Invalid client information.'));
            }
        },

        getRefreshToken: function (bearerToken, callback) {
            callback(new Error('Not yet implemented.'));
        },

        grantTypeAllowed: function (clientId, grantType, callback) {
            var data = _.find(authorizedClients, function (d) {
                return d.clientId === clientId;
            });
            callback(null, _.some(data.grantTypes, function (t) {
                return t.toLowerCase() === grantType.toLowerCase();
            }));
        },

        saveAccessToken: function (accessToken, clientId, expires, userId, callback) {
            callback(null);
        },

        saveRefreshToken: function (refreshToken, clientId, expires, userId, callback) {
            callback(null);
        },

        getUser: function (username, password, callback) {
            readTestUserFile(function (err, user) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, (username === user.userId && password === "password") ? user : false);
                }
            });
        },

        generateToken: function (type, req, callback) {
            var options = {
                algorithm: 'HS512',
                expiresInMinutes: 60 * 24
            };
            readTestUserFile(function (err, user) {
                var token;
                if (err) {
                    callback(err);
                }
                else {
                    user.clientId = req.oauth.client.clientId;
                    token = jwt.sign(user, secretKey, options);
                    callback(null, token);
                }
            });
        }
    };

    return model;

    function readTestUserFile(callback) {
        fs.readFile(testUserFileName, 'utf8', function (err, data) {
            if (err) {
                callback(err);
            }
            else {
                var user = JSON.parse(data);
                callback(null, user);
            }
        });
    }

    function initializeTestUserFile(callback) {
        readTestUserFile(function (err, user) {
            user = user || {};
            if (!user.userId || /^TestUser__/.test(user.userId)) {
                user = {
                    userId: "test",
                    userName: "Test User",
                    roles: ["basic"]
                };
                fs.writeFile(testUserFileName, JSON.stringify(user, null, 4), callback);
            }
            else {
                callback();
            }
        });
    }
};
