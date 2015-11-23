(function() {
    'use strict';

    angular
        .module('mainApp')
        .directive('shcExpressionAndOrToggle', [
            ExpressionAndOrToggle
        ]);

    function ExpressionAndOrToggle() {
        return {
            restrict: 'A',
            templateUrl: 'app/directives/expressions/expressionAndOrToggle.html',
            scope: {
                handler: '='
            },
            link: function(scope, element, attr) {

                scope.$watch('handler.node', function(node) {
                    if(node) {
                        if(node.isAndOperator) {
                            attr.$addClass('is-and');
                        }
                        else if(node.isOrOperator) {
                            attr.$addClass('is-or');
                        }
                    }
                });
            }
        }
    }

}());
