(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('providerDashboardViewCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            DashboardProviderViewCtrl
        ]);

    function DashboardProviderViewCtrl($rootScope, $scope, panelStates) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.selectedView = 0;

    }

    DashboardProviderViewCtrl.prototype = {

        get widgetClasses() {
            if(this.panelStates.isAttributesPanelOpen && this.panelStates.isFiltersPanelOpen && this.panelStates.isFiltersPanelExpanded) {
                return "col-sm-12 col-md-12 col-lg-12";
            }else if(this.panelStates.isAttributesPanelOpen && this.panelStates.isFiltersPanelOpen) {
                return "col-sm-6 col-md-6 col-lg-6";
            }else if(this.panelStates.isAttributesPanelOpen || this.panelStates.isFiltersPanelOpen) {
                return "col-sm-12 col-md-6 col-lg-6";
            }
            else {
                return "col-sm-12 col-md-4 col-lg-4";
            }
        },
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
