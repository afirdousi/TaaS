(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('testerProjectCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            TesterProjectCtrl
        ]);

    function TesterProjectCtrl($rootScope, $scope, panelStates) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;

        this.selectedView = 1;


    }

    TesterProjectCtrl.prototype = {

        get isCurrentProjectView() {
            return this.selectedView === 1;
        },
        get isPastProjectView() {
            return this.selectedView === 2;
        },
        get pageHeader(){
            return 'Project Dashboard';
        },
        selectCurrentProjectView: function() {
            this.selectedView = 1;
        },
        selectPastProjectView: function() {
            this.selectedView = 2;
        },

    }

})();
