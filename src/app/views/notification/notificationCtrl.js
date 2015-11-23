(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('notificationCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            NotificationCtrl
        ]);

    function NotificationCtrl($rootScope, $scope, panelStates) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;

        this.selectedView = 1;

    }

    NotificationCtrl.prototype = {

        get isOption1() {
            return this.selectedView === 1;
        },
        get isOption2() {
            return this.selectedView === 2;
        },
        get pageHeader(){
            return 'Notifications';
        },
        selectOption1: function() {
            this.selectedView = 1;
        },
        selectOption2: function() {
            this.selectedView = 2;
        }

    }

})();
