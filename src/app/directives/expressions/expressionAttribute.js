(function() {
    'use strict';

    angular
        .module('mainApp')
        .directive('shcExpressionAttribute', [
            ExpressionAttribute
        ]);

    function ExpressionAttribute() {
        return {
            restrict: 'A',
            templateUrl: 'app/directives/expressions/expressionAttribute.html',
            scope: {
                handler: '='
            },
            link: function(scope, element, attr) {

                scope.$watch('handler.node.isNegated', function(isNegated) {
                    if(isNegated) {
                        attr.$addClass('negated');
                    }
                    else {
                        attr.$removeClass('negated');
                    }
                });
            }
        }
    }

}());
