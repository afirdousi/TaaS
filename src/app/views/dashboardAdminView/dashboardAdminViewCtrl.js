(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('dashboardAdminViewCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            DashboardAdminViewCtrl
        ]);

    function DashboardAdminViewCtrl($rootScope, $scope, panelStates) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.selectedView = 0;

    }

    DashboardAdminViewCtrl.prototype = {

        get isDashboardView() {
            return this.selectedView === 0;
        },
        get isReportView(){
            return this.selectedView === 1;
        },

        get pageHeader(){
            return 'User Dashboard';
        },
        selectDashboardView: function() {
            this.selectedView = 0;
        },

        selectReportDataView : function() {
            this.selectedView = 1;
        }
    };

})();
