(function() {

    'use strict';

    angular
        .module('mainApp')
        .directive('smartInclude', [
            function() {
                return {
                    restrict: 'A',
                    templateUrl: function (element, attr) {
                        return attr.smartInclude;
                    }
                };
            }]);

}());
