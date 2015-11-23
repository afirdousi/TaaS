(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('newOfferCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            TesterNewOfferCtrl
        ]);

    function TesterNewOfferCtrl($rootScope, $scope, panelStates) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;

        this.selectedView = 1;


    }

    TesterNewOfferCtrl.prototype = {

        get isOption1() {
            return this.selectedView === 1;
        },
        get isOption2() {
            return this.selectedView === 2;
        },
        get pageHeader(){
            return 'New Project Offers';
        },
        selectOption1: function() {
            this.selectedView = 1;
        },
        selectOption2: function() {
            this.selectedView = 2;
        }

    }

})();
