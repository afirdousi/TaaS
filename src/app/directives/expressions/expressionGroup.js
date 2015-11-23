(function() {
    'use strict';

    angular
        .module('mainApp')
        .directive('shcExpressionGroup', [
            ExpressionGroup
        ]);

    function ExpressionGroup() {
        return {
            restrict: 'A',
            templateUrl: 'app/directives/expressions/expressionGroup.html',
            transclude: true,
            scope: {
                handler: '='
            },
            link: function(scope, element, attr) {

                element.on('click', function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    if(scope.handler && scope.handler.isSelectable) {
                        scope.handler.isSelected = !scope.handler.isSelected;
                    }
                });

                scope.$watch('handler.isNegated', function(isNegated) {
                    if(isNegated) {
                        attr.$addClass('negated');
                    }
                    else {
                        attr.$removeClass('negated');
                    }
                });

                scope.$watch('handler.isSelected', function(isNegated) {
                    if(isNegated) {
                        attr.$addClass('is-selected');
                    }
                    else {
                        attr.$removeClass('is-selected');
                    }
                });
            }
        }
    }

}());
