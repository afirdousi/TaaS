var Q = require('q');
var mongodb = require('mongodb');
var mongodbConfig = require('../services/webSettings').mongodb;

function MongoDBClient(config) {

    this.client = mongodb.MongoClient;
    this.config = config;
    this.connectionDeferred = null;
}

MongoDBClient.prototype = {

    get isConnected() {
        return !!this.connectionDeferred;
    },

    connect: function() {

        var self = this;
        var config, serverOpts, deferred, server, db;

        if(!self.isConnected) {

            deferred = self.connectionDeferred = Q.defer();
            config = self.config;
            serverOpts = {
                ssl: config.useSSL,
                sslValidate: config.useSSL && config.validateSSL
            };
            server = new mongodb.Server(config.host, config.port, serverOpts);
            db = new mongodb.Db(config.database, server);

            db.open(function(err, db) {
                if(err) {
                    deferred.reject(err);
                    return;
                }
                if(config.user && config.password) {
                    db.authenticate(config.user, config.password, function(err, result) {
                        if(err) {
                            db.close();
                            deferred.reject(err);
                            return;
                        }
                        deferred.resolve(db);
                    });
                }
                else {
                    deferred.resolve(db);
                }

            });

        }
        return self.connectionDeferred.promise;
    },

    close: function() {
        var self = this;
        if(self.isConnected) {
            self.connect()
                .then(function(db) {
                    self.connectionDeferred = null;
                    db.close();
                }, function(err) {
                    console.log("Error closing connection.");
                    console.log(err);
                });
        }
    }

};

module.exports = new MongoDBClient(mongodbConfig);
