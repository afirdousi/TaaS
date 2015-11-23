
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var users = require('../db/users');

module.exports = function(webSettings) {

    var ldapLookup = require('./ldapLookup')(webSettings);

    var secretKey = webSettings.authentication.secretKey;
    var authorizedClients = _.map(webSettings.authentication.authorizedClients, function(client) {
        return {
            clientId: client.id,
            clientSecret: client.secret,
            grantTypes: ['password']
        };
    });

    var model = {

        getAccessToken: function (bearerToken, callback) {
            var options = {
                algorithms: ['HS512']
            };
            jwt.verify(bearerToken, secretKey, options, function (err, decoded) {
                if(err) {
                    callback(err);
                    return; // Hotfix for OAuth Session Timeout Issue, we need to fix it properly
                }

                var user = {
                    userId: decoded.userId,
                    userName: decoded.userName,
                    fullName:decoded.fullName,
                    email:decoded.email,
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
            if(data) {
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
            callback(null, _.some(data.grantTypes, function(t) {
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
            users
                .getUser(username)
                .then(function(dbUser) {
                    if(dbUser === null) {
                        callback(null, false);
                    }
                    else {
                        ldapLookup
                            .authenticateUser(username, password)
                            .then(function(ldapUser) {

                                var user = {
                                    userId: ldapUser.userId,
                                    userName: ldapUser.userName,
                                    roles: dbUser.roles,
                                    fullName: ldapUser.fullName,
                                    email:ldapUser.email
                                };
                                callback(null, user);
                            })
                            .catch(function(err) {
                                console.log("error:", err);
                                callback(null, false);
                            });
                    }
                })
                .catch(function(err) {
                    console.log("error:", err);
                    callback(err);
                });
        },

        generateToken: function(type, req, callback) {
            var options = {
                algorithm: 'HS512',
                expiresInMinutes: 60 * 24
            };
            var user = req.user;
            user.clientId = req.oauth.client.clientId;
            token = jwt.sign(user, secretKey, options);
            callback(null, token);
        }
    };

    return model;
};
