(function () {
    'use strict';

    var mainApp = angular.module('mainApp', [
        'mainApp-settings',
        'ui.router',
        'ui.bootstrap',
        'ui.grid',
        'ngAnimate',
        'ngResource',
        'FBAngular',
        'fsm',
        'cgPrompt'

    ]);

    mainApp.config([
        '$provide',
        '$httpProvider',
        function ($provide, $httpProvider) {

            $provide.factory('errorHttpInterceptor', [
                '$q',
                '$log',
                'bigBox',
                'AuthServiceState',
                function ($q, $log, bigBox, AuthServiceState) {

                    var errorCounter = 0;

                    return {
                        request: function(config) {
                            config = config || {};
                            config.headers = config.headers || {};
                            if(!config.noAuthorizationRequired) {
                                AuthServiceState.addBearerToken(config.headers);
                            }
                            return config;
                        },
                        requestError: function (rejection) {
                            if (!rejection.config.noErrorNotification) {
                                notifyError(rejection);
                            }
                            return $q.reject(rejection);
                        },
                        responseError: function (rejection) {
                            if (!rejection.config.noErrorNotification) {
                                notifyError(rejection);
                            }
                            return $q.reject(rejection);
                        }
                    };

                    function notifyError(rejection) {
                        $log.error(rejection);
                        /*bigBox({
                            title: rejection.status + ' ' + rejection.statusText,
                            content: transformErrorData(rejection.data),
                            color: "#C46A69",
                            icon: "fa fa-warning shake animated",
                            number: ++errorCounter,
                            timeout: 10000
                        });*/
                    }
                }]);

            $httpProvider.interceptors.push('errorHttpInterceptor');

            function transformErrorData(data) {
                if (data) {
                    if(_.isString(data.error)) {
                        return data.error;
                    }
                    if(_.isObject(data.error)) {
                        return _(data.error)
                            .map(function (v, k) {
                                return [k, v].join(": ");
                            })
                            .value()
                            .join(", ");
                    }
                }
                return "Error occurred.";
            }
        }
    ]);

    // Add authentication checks to routes
    mainApp
        .config(['$stateProvider', function ($stateProvider) {

            var originalStateFunction = $stateProvider.state;

            $stateProvider.state = function (state, config) {

                if(_.isObject(config) && !config.abstract) {

                    _.defaults(config.resolve || (config.resolve = {}), {
                        verifyRoute: [
                            '$q',
                            '$log',
                            'AuthServiceState',
                            function($q, $log, authSvc) {

                                var st = authSvc.stateTransition || {};

                                if (st.isLoginPage && authSvc.isAuthenticated()) {
                                    return $q.reject({
                                        routeTo: 'app.search'
                                    });
                                }

                                if(st.authorizedRoles && st.authorizedRoles.length) {

                                    if (!authSvc.isAuthenticated()) {
                                        return $q.reject({
                                            routeTo: 'app.login'
                                        });
                                    }

                                    return authSvc
                                        .getCurrentUserPromise()
                                        .then(function() {

                                            if (!authSvc.isInRole(st.authorizedRoles)) {
                                                return $q.reject({
                                                    routeTo: 'app.accessDenied'
                                                });
                                            }
                                        });
                                }
                            }
                        ]
                    });
                }

                return originalStateFunction.apply(this, arguments);
            };
        }]);


    mainApp.run([
        '$rootScope',
        '$state',
        '$urlRouter',
        'AUTH_EVENTS',
        'AuthServiceState',
        '$window',
        '$',
        '$timeout',
        function ($rootScope, $state, $urlRouter, AUTH_EVENTS, AuthServiceState, $window, $,$timeout) {

            $rootScope.$on(
                '$stateChangeStart',
                function (event, toState, toStateParams) {
                    var stateData = toState.data || {};
                    AuthServiceState.stateTransition = {
                        stateName: toState.name,
                        isLoginPage: !!stateData.isLoginPage,
                        authorizedRoles: stateData.authorizedRoles || []
                    };
                });

            $rootScope.$on(
                '$stateChangeError',
                function (event, toState, toParams, fromState, fromParams, error) {
                    if(error && error.routeTo) {
                        event.preventDefault();
                        $state.go(error.routeTo);
                    }
                });

            $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {

                $state.go('app.search');

            });

            $rootScope.$on(AUTH_EVENTS.logout, function () {
                $state.go('app.login');
            });


            ///////////////////////////////////////////////////////////////////////
            // TODO: move the below to a directive (on the BODY element)

            function orientation_change() {

                var portrait = ($window.orientation % 180 === 0);
                if (!$window.orientation) {
                    portrait = $($window).width() < $($window).height();
                }

                show_orientationchange_message(portrait); // First approch [show message with backdrop]

                //$("body").css("-webkit-transform", portrait ? "rotate(-90deg)" : ""); // Second approch [rotate the html content]

            }
            function show_orientationchange_message(portrait) {

                if (portrait) {
                    // $('.oriantaion').modal({backdrop: 'static'})
                    $('.oriantaion').modal('show');

                } else {
                    //$("body").css("-webkit-transform","");
                    $('.oriantaion').modal('hide');
                }
            }
            orientation_change();
            $window.addEventListener('resize', orientation_change);
            $window.addEventListener('orientationchange', orientation_change);

            ///////////////////////////////////////////////////////////////////////

        }]);
})();
