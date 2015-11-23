(function() {
    'use strict';

    angular
        .module('mainApp')
        .service('sharedQuery', [
            '$q',
            'AuthServiceState',
            SharedQueryFactory
        ]);

    function SharedQueryFactory($q, AuthServiceState) {
        this.$q = $q;
        this.authServiceState = AuthServiceState;
    }

    SharedQueryFactory.prototype = {
        create: function(queryMethod) {
            return new SharedQuery(this.$q, this.authServiceState, queryMethod);
        }
    };

    function SharedQuery($q, authServiceState, queryMethod) {
        this.$q = $q;
        this.authServiceState = authServiceState;
        this.queryMethod = queryMethod;
        this._queryDeferred = null;
    }

    SharedQuery.prototype = {
        reset: function() {
            this._queryDeferred = null;
        },
        execQuery: function() {
            var deferred = this._queryDeferred;
            if(!deferred) {
                deferred = this._queryDeferred = this.$q.defer();
                if(this.authServiceState.isAuthenticated()) {
                    this.queryMethod().then(function(result) {
                        deferred.resolve(result);
                    }, function(result) {
                        deferred.reject(result);
                    });
                }
                else {
                    deferred.reject();
                }
            }
            return deferred.promise;
        }
    };

})();
