(function() {

    'use strict';

    angular
        .module('mainApp')
        .directive('shcClickFeedback', function() {
            return {
                restrict: 'A',
                link: function(scope, element) {
                    element.css("cursor", "pointer");
                    element.on('mousedown', function() {
                        element.addClass('fade');
                    });
                    element.on('mouseup', function() {
                        element.addClass('fade');
                        element.addClass('in');
                    });
                    element.on('mouseout', function() {
                        element.removeClass('fade');
                        element.removeClass('in');
                    });
                }
            };
        });

}());

