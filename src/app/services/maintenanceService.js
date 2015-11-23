/**
 * Created by afirdou on 9/21/2015.
 */
(function() {
    'use strict'
    angular.module('mainApp')
        .service('maintenanceService', [
            'appConfig',
            '$http',
            MaintenanceService]);

    function MaintenanceService(appConfig,$http) {
        var self = this;

        this.appConfig = appConfig;
        this.$http = $http;

        this.appStatus = {};
    }

    MaintenanceService.prototype = {

        getApplicationState:function(){

            /*return {
                status:'U',
                message:"This is a sample message!!!"
            }*/
            var self = this;

            return this.$http({
                    method: 'GET',
                    url: this.appConfig.contextRoot +  '/api/maintenance/'
                    }).then(function(result) {
                         self.appStatus = result.data;
                         //result.data.status ="U";
                         return result.data;
                    });

        },
        setApplicationState:function(status,msg){

            var self = this;

            return this.$http({
                method: 'POST',
                url: this.appConfig.contextRoot +  '/api/maintenance/',
                data: {
                    status:status,
                    msg:msg
                }
            }).then(function(result) {
                self.appStatus = result.data;
                return result.data;
            });


        }


    }
})();