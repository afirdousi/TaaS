(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('testerProfileCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            TesterProfileCtrl
        ]);

    function TesterProfileCtrl($rootScope, $scope, panelStates) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;

        this.selectedView = 1;


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

    }

})();
