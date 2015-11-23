/**
 * Created by afirdou on 9/21/2015.
 */
(function(){

    "use strict";

    angular
        .module('mainApp')
        .controller('maintenanceViewCtrl', [
            'maintenanceService',
            maintenanceViewCtrl
        ]);

    function maintenanceViewCtrl(maintenanceService) {

        this.maintenanceService = maintenanceService;
        this.isApplicationUpOriginal = this.isApplicationUp = '';
        this.appStatusMessage = '';

        this.getCurrentApplicationState();


    }

    maintenanceViewCtrl.prototype = {

        get hasAppStatusChanged(){
          return vmMaintenance.isApplicationUp !==vmMaintenance.isApplicationUpOriginal
                 || self.appStatusMessageOriginal !== self.appStatusMessage;
        },

        getCurrentApplicationState:function(){
            var self = this;

            this.maintenanceService
                .getApplicationState()
                .then(function(result){
                    //console.log(result);
                    self.isApplicationUpOriginal = self.isApplicationUp = result.status;
                    self.appStatusMessageOriginal = self.appStatusMessage = result.msg;

                });

        },

        saveMaintenanceMode:function(){
            var self = this;

            self.isApplicationUpOriginal = self.isApplicationUp;
            self.appStatusMessageOriginal = self.appStatusMessage;
            this.maintenanceService
                .setApplicationState(this.isApplicationUp,this.appStatusMessage)
                .then(function(result){


                });

        }


    };

}());