(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('testerBugCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            TesterBugController
        ]);

    function TesterBugController($rootScope, $scope, panelStates) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;

        this.selectedView = 1;


    }

    TesterBugController.prototype = {

        get isOption1() {
            return this.selectedView === 1;
        },
        get isOption2() {
            return this.selectedView === 2;
        },
        get pageHeader(){
            return 'Bug Tracker';
        },
        selectOption1: function() {
            this.selectedView = 1;
        },
        selectOption2: function() {
            this.selectedView = 2;
        },

    }

})();
