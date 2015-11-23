/**
 * Created by afirdou on 5/3/2015.
 */

(function() {

    'use strict';

    angular
        .module('mainApp')
        .directive('ngConfirmClick', [
            function() {
                return {
                    link: function (scope, element, attr) {
                        var msg = attr.ngConfirmClick || "Are you sure?";
                        var clickAction = attr.confirmedClick;
                        element.bind('click',function (event) {
                            if ( window.confirm(msg) ) {
                                scope.$eval(clickAction)
                            }
                        });
                    }
                };
            }
        ]);

}());
