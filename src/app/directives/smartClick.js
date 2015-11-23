(function() {

    'use strict';

    angular
        .module('mainApp')
        .directive('smartClick', [
            function () {
                return {
                    restrict: 'A',
                    link: function($scope, element) {
                        var scope = $scope;
                        element.on('click', function() {
                            scope.$broadcast('closeAttributePopOverModel');

                        });
                    }
                    
                };
            }]);
}());
