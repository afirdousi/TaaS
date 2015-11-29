(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('testerPaymentCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            'testerPaymentService',
            TesterPaymentControl
        ]);

    function TesterPaymentControl($rootScope, $scope, panelStates,testerPaymentService) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.testerPayment = testerPaymentService;

        this.selectedView = 1;
        this.payment = {};

        this.init();

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
        },
        init: function () {
            var self = this;

            this.testerPayment
                .getFullPayment()
                .then(function(data){

                    //console.log("Profile data is here:");
                    //console.log(data);

                    self.payment = data;

                });

        }
        /*
        get getEarnTotal(){
            var totalEarn = 0;
            for(var i = 0; i < $scope.payment.earnPerApp.length; i++){
                var earn = $scope.payment.earnPerApp[i];
                totalEarn += earn;
            }
            return totalEarn;
        }
*/

    }

})();
