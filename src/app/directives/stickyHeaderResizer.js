(function() {

    'use strict';

    angular
        .module('mainApp')
        .directive('shcStickyHeaderResizer', [
            function() {
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        var parentElement, parentSelector = attrs.scrollBody;
                        if(parentSelector) {
                            parentSelector = parentSelector.replace(/^["']|["']$/g, "");
                            parentElement = angular.element(parentSelector);
                            parentElement.resize(function() {
                                element.trigger('scroll');
                            });
                        }
                    }
                };
            }]);

}());