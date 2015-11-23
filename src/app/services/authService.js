(function () {
    'use strict';

    angular
        .module('mainApp')
        .service('AuthService', [
            '$q',
            '$http',
            '$rootScope',
            'sessionStorage',
            'appConfig',
            'AUTH_EVENTS',
            'sharedQuery',
            AuthService
        ])
        .service('AuthServiceState', [
            '$q',
            'sessionStorage',
            AuthServiceState
        ])
        .run([
            'AuthService',
            function(AuthService) {
                // Ensures that AuthService has been initialized
                // along with currentUserQuery.
            }
        ]);

    var currentUser = {
        userId: null,
        userName: null,
        roles: []
    };
    var currentUserQuery;

    function AuthService(
        $q,
        $http,
        $rootScope,
        sessionStorage,
        appConfig,
        AUTH_EVENTS,
        sharedQuery
    ) {

        var self = this;

        this.$q = $q;
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.sessionStorage = sessionStorage;
        this.appConfig = appConfig;
        this.AUTH_EVENTS = AUTH_EVENTS;
        currentUserQuery = sharedQuery.create(function() {
            return self._refreshCurrentUser();
        });
        currentUserQuery.execQuery();
    }

    AuthService.prototype = {

        login: function (credentials) {
            var self = this;
            var authKey = btoa([
                self.appConfig.clientId,
                self.appConfig.clientKey
            ].join(':'));
            return self
                .$http({
                    url: self.appConfig.contextRoot + '/oauth/token',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + authKey
                    },
                    transformRequest: function (content) {
                        if (!_.isObject(content)) {
                            return content;
                        }
                        return _.map(content, function (v, k) {
                            return [encodeURIComponent(k), encodeURIComponent(v)].join("=");
                        }).join("&");
                    },
                    data: {
                        username: credentials.username,
                        password: credentials.password,
                        grant_type: 'password'
                    },
                    noErrorNotification: true,
                    noAuthorizationRequired: true
                })
                .then(function (result) {
                    self.sessionStorage.setItem('bearerToken', result.data.access_token);
                    currentUserQuery.reset();
                    return currentUserQuery.execQuery();  
                  }).then(function(){
                     self.$rootScope.$broadcast(self.AUTH_EVENTS.loginSuccess);
                 })
                .catch(function(err) {
                    self.$rootScope.$broadcast(self.AUTH_EVENTS.loginFailed);
                    return self.$q.reject(err);
                });
        },

        searchLDAPUsers: function (LDAPName) {
            var self = this;
            return this.$http({
                method: 'GET',
                url: self.appConfig.contextRoot + '/auth/user/',
                params: LDAPName
            }).then(function (result) {
                return result.data;
            });
        },

        logout: function () {
            currentUser = {
                userId: null,
                userName: null,
                roles: []
            };
            this.sessionStorage.removeItem('bearerToken');
            this.$rootScope.$broadcast(this.AUTH_EVENTS.logout);
        },

        _refreshCurrentUser: function() {

            var self = this;
            return this.$http({
                method: 'GET',
                url: './api/currentUser'
            }).then(function(result) {
                currentUser = result.data;
                //Log user to PIWIK or any logging library here
                return currentUser;
            });
        }
    };

    function AuthServiceState($q, sessionStorage) {
        this.$q = $q;
        this.sessionStorage = sessionStorage;
    }

    AuthServiceState.prototype = {

        isAuthenticated: function () {
            return !!this.sessionStorage.getItem('bearerToken');
        },

        get currentAccessToken() {
            return this.sessionStorage.getItem('bearerToken');
        },

        get currentUser() {
            return currentUser;
        },

        get currentUserId() {
            return currentUser.userId;
        },

        get currentUserName() {
            return currentUser.userName;
        },

        get isInAdminRole() {
            return this.isInRole("admin");
        },
        get isInBasicRole() {
            return this.isInRole("basic");
        },
        get isInAdvanceRole() {
            return this.isInRole("advance");
        },
        get isInScheduleRole() {
            return this.isInRole("schedule");
        },
        get isOnlyInBasicRole(){
            return !(this.isInAdvanceRole || this.isInAdminRole);
        },

        // Pass in one or more role strings,
        // returns true if current user's roles match any
        // of the values ('or' test).
        isInRole: function() {
            var roles = _.flatten(Array.prototype.slice.call(arguments));
            return _.some(currentUser.roles, function(userRole) {
                return _.some(roles, function(testRole) {
                    return userRole.toLowerCase() === testRole.toLowerCase();
                });
            });
        },

        addBearerToken: function (headers) {
            var token = this.currentAccessToken;
            if (token && _.isObject(headers)) {
                headers['Authorization'] = 'Bearer ' + token;
            }
        },

        getCurrentUserPromise: function() {
            var $q = this.$q;
            if(!currentUserQuery) {
                return $q.reject(new Error("Current user query not initialized."));
            }
            return currentUserQuery.execQuery();
        }
    };

})();
