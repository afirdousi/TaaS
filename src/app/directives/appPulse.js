/**
 * Created by afirdou on 9/24/2015.
 */
(function() {

    'use strict';

    angular
        .module('mainApp')
        .directive('appPulse', [
            'AuthServiceState',
            'maintenanceService',
            '$rootScope',
            '$timeout',
            function (authServiceState, maintenanceService, $rootScope, $interval) {
                return {
                    restrict: 'E',
                    link: function (scope, element, attrs, ctrl) {

                        var self = this;

                        $interval(function () {
                            console.log((new Date()).toISOString() + " : App pulse every 5 seconds");

                            if(authServiceState.currentUser.userId) {
                                //User logged in

                                maintenanceService
                                    .getApplicationState()
                                    .then(function (result) {
                                        if (result.status === "D") {
                                            //User Logged In
                                            if (!authServiceState.isInAdminRole) {
                                                console.log("App is down: DOWNTIME DETECTED");
                                                authService.logoutToMaintenance();
                                            } else {
                                                //Admin User
                                                $rootScope.$broadcast("MAINTENANCE_MODE_ON")
                                            }
                                        }

                                    });
                            }else{
                                //User has not yet logged in
                                console.log("User has not yet logged in");
                            }

                        }, 5000);


                    }


                };

            }]);
}());