(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('testerProfileCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            'testerProfileService',
            TesterProfileCtrl
        ]);

    function TesterProfileCtrl($rootScope, $scope, panelStates,testerProfileService) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.testerProfile = testerProfileService;

        this.selectedView = 1;
        this.profile = {}; // full profile data is populated in this one


        this.init();

    }

    TesterProfileCtrl.prototype = {

        get isOption1() {
            return this.selectedView === 1;
        },
        get isOption2() {
            return this.selectedView === 2;
        },
        get pageHeader(){
            return 'User Profile';
        },
        selectOption1: function() {
            this.selectedView = 1;
        },
        selectOption2: function() {
            this.selectedView = 2;
        },
        init: function () {
            var self = this;

            this.testerProfile
                .getFullProfile()
                .then(function(data){

                    //console.log("Profile data is here:");
                    //console.log(data);

                    self.profile = data;

                });

        }

    }

})();
