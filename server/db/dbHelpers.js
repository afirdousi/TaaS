
var _ = require('lodash');
var Q = require('q');
var mongodbClient = require('./mongodbClient');

function DbHelpers() {
}

DbHelpers.prototype = {

    get resultAsArray() {
        return function(cursor) {
            var toArray = Q.nbind(cursor.toArray, cursor);
            return toArray();
        };
    },

    getCollection: function(name) {

        return mongodbClient
            .connect()
            .then(function(db) {
                var mongoCollection = db.collection(name);
                var wrappedCollection = new PromiseWrappedCollection(mongoCollection);
                return wrappedCollection;
            });
    },

    getAppMaintenanceCollection: function() {
        return this.getCollection("taas_maintenance");
    },

    getTesterProfileCollection: function() {
        return this.getCollection("tester_profile");
    },
    getTesterPaymentCollection: function() {
        return this.getCollection("tester_payment");
    },

    getProjectCollection: function() {
        return this.getCollection("tester_project");
    }
};

function PromiseWrappedCollection(collection) {
    this.collection = collection;
}

PromiseWrappedCollection.prototype = {

    get _wrappedMethods() {
        return this.collection.__wrapped__methods__ || (this.collection.__wrapped__methods__ = {});
    },

    find: function() {
        return Q.when(this.collection.find.apply(this.collection, _.toArray(arguments)));
    }

};

_.each([
    'findOne',
    'insert',
    'update',
    'remove'
], function(name) {
    PromiseWrappedCollection.prototype[name] = function() {
        var binding = this._wrappedMethods[name];
        if(!binding) {
            this._wrappedMethods[name] = binding = Q.nbind(this.collection[name], this.collection);
        }
        return binding.apply(null, _.toArray(arguments));
    };
});

module.exports = new DbHelpers();
