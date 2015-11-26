
(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('testerPaymentCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            TesterPaymentControl
        ]);

    function TesterPaymentControl($rootScope, $scope, panelStates) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;

        this.selectedView = 1;


    }

    TesterPaymentControl.prototype = {

        get isOption1() {
            return this.selectedView === 1;
        },
        get isOption2() {
            return this.selectedView === 2;
        },
        get pageHeader(){
            return 'User Payment';
        },
        selectOption1: function() {
            this.selectedView = 1;
        },
        selectOption2: function() {
            this.selectedView = 2;
        }

    }

})();
