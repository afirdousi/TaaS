(function () {

    "use strict";

    angular
        .module('mainApp')
        .controller('loginCtrl', [
            'AuthService',
            LoginCtrl
        ]);

    function LoginCtrl(AuthService) {

        this.credential = {
            username: '',
            password: ''
        };
        this.loginResult = '';

        this.AuthService = AuthService;
        this.isInvalidCredential = false;
    }

    LoginCtrl.prototype = {

        login: function () {

            var self = this;
            self.AuthService.login(self.credential)
                .then(function () {
                    self.isInvalidCredential = false;
                }, function () {
                    self.isInvalidCredential = true;
                    self.loginResult = 'Please use your correct TaaS-SJSU ID / Password combination.';
                });
        }
    };

}());
