/**
 * Created by Anas on 11/29/2015.
 */
(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('providerPaymentCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            ProviderPaymentCtrl
        ]);

    function ProviderPaymentCtrl($rootScope, $scope, panelStates) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;

        this.selectedView = 1;


    }

    ProviderPaymentCtrl.prototype = {

        get isOption1() {
            return this.selectedView === 1;
        },
        get isOption2() {
            return this.selectedView === 2;
        },
        get pageHeader(){
            return 'Provider Profile';
        },
        selectOption1: function() {
            this.selectedView = 1;
        },
        selectOption2: function() {
            this.selectedView = 2;
        },

    }

})();
