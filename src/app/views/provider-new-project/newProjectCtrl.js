/**
 * Created by Anas on 11/29/2015.
 */
(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('newProjectCtrl', [
            '$rootScope',
            '$scope',
            'panelStates',
            NewProjectCtrl
        ]);

    function NewProjectCtrl($rootScope, $scope, panelStates) {

        this.panelStates = panelStates;
        this.$scope = $scope;
        this.$rootScope = $rootScope;

        this.selectedView = 1;


    }

    NewProjectCtrl.prototype = {

        get isOption1() {
            return this.selectedView === 1;
        },
        get isOption2() {
            return this.selectedView === 2;
        },
        get pageHeader(){
            return 'Post Your Project - Get your App tested by the best!';
        },
        selectOption1: function() {
            this.selectedView = 1;
        },
        selectOption2: function() {
            this.selectedView = 2;
        },

    }

})();
