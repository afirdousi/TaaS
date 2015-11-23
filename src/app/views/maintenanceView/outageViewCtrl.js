/**
 * Created by afirdou on 9/22/2015.
 */
(function(){

    "use strict";

    angular
        .module('mainApp')
        .controller('outageViewCtrl', [
            'maintenanceService',
            '$rootScope',
            OutageViewCtrl
        ]);

    function OutageViewCtrl(maintenanceService,$rootScope) {

        var self = this;

        this.maintenanceService = maintenanceService;
        this.$rootScope = $rootScope;
        this.message = "";


        this.maintenanceService
            .getApplicationState()
            .then(function(result){
                self.message = result.msg;

                ////console.log("Outage View: Will logout in 10 seconds.");
               /* self.$timeout(function(){
                        self.authService.logout();
                },10000);*/

            });

        //console.log("Outage View Controller : REQUEST TO STOP_MAINTENANCE_MODE_CHECK");
        this.$rootScope.$broadcast("STOP_MAINTENANCE_MODE_CHECK");

    }

    OutageViewCtrl.prototype = {

    };

}());