(function() {
    'use strict';

    var mainApp = angular.module('mainApp');

    //======================================================
    // The 'appConfig' value has been moved to a virtual
    // file named "webSettings.js" (see express-server.js).
    // The place to change the web properties is now in:
    //
    //      server/webSettings.json
    //
    // The values from this file are used to populate
    // the 'appConfig' value for the Angular module.
    //======================================================

    mainApp.config([
        'datepickerConfig',
        function (datepickerConfig) {
            datepickerConfig.showWeeks = false;
        }]);

    mainApp.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized',
        logout:'auth-logout'
    });

    mainApp.constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        basic: 'basic',
        advance:'advance',
        schedule:'schedule'
    });

})();
