(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('dashboardViewCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            DashboardViewCtrl
        ]);

    function DashboardViewCtrl($rootScope, $scope, panelStates) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.selectedView = 0;


        this.selected = undefined;
        this.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    }

    DashboardViewCtrl.prototype = {

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
        },
        getLocation : function(val) {
            return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: val,
                    sensor: false
                }
            }).then(function(response){
                return response.data.results.map(function(item){
                    return item.formatted_address;
                });
            });
        }
    };

})();
