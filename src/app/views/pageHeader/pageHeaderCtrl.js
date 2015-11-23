/* global introJs */
(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('pageHeaderCtrl', [
            '$scope',
            '$window',
            '$log',
            '$',
            'Fullscreen',
            '$rootScope',
            'panelStates',
            'AuthServiceState',
            'appConfig',
            PageHeaderCtrl
        ]);

    function PageHeaderCtrl($scope, $window, $log, $, Fullscreen,  $rootScope, panelStates, AuthServiceState,   appConfig) {
        var self = this;
        this.$log = $log;
        this.$=$;
        this.fullScreen = Fullscreen;
        this.appConfig = appConfig;
        this.stats_fields = {};

        this.break1 = false;
        this.$rootScope = $rootScope;
        this.panelStates=panelStates;
        this.AuthServiceState = AuthServiceState;


        $scope.$watch(function() {
            return $window.innerWidth;
        }, function(width) {
            // Reset
            if(width < 1075) {
                self.break1 = true;
                if(!self.menu) {
                    self.menuButtons = false;
                }
            } else {
                self.break1 = false;
                self.menu = false;
                self.menuButtons = true;
            }
        });

    }

    PageHeaderCtrl.prototype = {

        get applicationVersion(){
            return this.appConfig.applicationVersion;
        },

        getMagnitude: function(field, type){
            var value = '';
            if(this.stats_fields[field] && this.stats_fields[field][type]){
                value = '';// this.membershipService.getMagnitude(this.stats_fields[field][type]);
            }
            return value;
        },
        get isSecure(){
            return this.AuthServiceState.isAuthenticated();
        },

        openMenu: function() {
            this.$rootScope.$broadcast("hamburgerMenuClicked");
            this.menu = !this.menu;
            var self = this;
            if(this.menu) {
                setTimeout(function() {
                    self.menuButtons = self.menu;
                }, 200);
            } else {
                self.menuButtons = false;
            }
        },
        getStatsQueryCounts: function() {
           /* var self = this;
            self.commonQuery
                .getQueryResultCount()
                .then(function(data) {

                    self.stats_fields = data.stats_fields;
                });*/
        },
        toggleFullScreen: function() {
            if (this.fullScreen.isEnabled()) {
                this.fullScreen.cancel();
            }
            else {
                this.fullScreen.all();
            }
        },


        togglePanels: function() {
            this.panelStates.togglePanels();
        }
    };

})();
