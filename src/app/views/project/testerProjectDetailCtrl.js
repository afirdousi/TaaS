(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('testerProjectDetailCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            '$stateParams',
            TesterProjectDetailCtrl
        ]);

    function TesterProjectDetailCtrl($rootScope, $scope, panelStates,$stateParams) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$stateParams = $stateParams;
        this.projectDetail= {
            name:"Project No." + this.$stateParams.projectId,
            description:"Some description about Project No." + this.$stateParams.projectId
        };
        this.projectName=this.projectDetail.name +' - Project Details ' ;

    }

    TesterProjectDetailCtrl.prototype = {

        get pageHeader(){
            return this.projectName;
        }

    }

})();
