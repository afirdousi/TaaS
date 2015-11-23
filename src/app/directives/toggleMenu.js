(function() {

    'use strict';

    angular
        .module('mainApp')
        .directive('toggleMenu', [
            function() {
                return {
                    restrict: 'A',
                    scope: {
                        toggleMenu: '@'
                    },
                    link: function (scope, element) {

                        var html = angular.element('html');
                        var body = angular.element('body');
                        var isOnMenuPanel = scope.toggleMenu === "on-panel";

                        element.on('click', toggleMenu);

                        function toggleMenu() {
                            if(isOnMenuPanel) {
                                if (!body.hasClass("menu-on-top")) {
                                    html.removeClass("hidden-menu-mobile-lock");
                                    body.toggleClass("minified");
                                    body.removeClass("hidden-menu");
                                }
                            }
                            else {
                                if (!body.hasClass("menu-on-top")){
                                    html.toggleClass("hidden-menu-mobile-lock");
                                    body.toggleClass("hidden-menu");
                                    body.removeClass("minified");
                                } else if ( body.hasClass("menu-on-top") && body.hasClass("mobile-view-activated") ) {
                                    html.toggleClass("hidden-menu-mobile-lock");
                                    body.toggleClass("hidden-menu");
                                    body.removeClass("minified");
                                }
                            }
                        }
                    }
                };
            }]);

}());

