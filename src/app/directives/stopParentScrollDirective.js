(function() {

    'use strict';

    angular
        .module('mainApp')
        .directive('shcStopParentScroll', function() {
            return {
                restrict: 'A',
                link: function(scope, element) {
                    element.on('DOMMouseScroll mousewheel', function(ev) {
                        var scrollTop = this.scrollTop,
                            scrollHeight = this.scrollHeight,
                            height = element.height(),
                            delta = ev.type === 'DOMMouseScroll' ?
                                ev.originalEvent.detail * -40 :
                                ev.originalEvent.wheelDelta,
                            up = delta > 0;

                        var prevent = function() {
                            ev.stopPropagation();
                            ev.preventDefault();
                            ev.returnValue = false;
                            return false;
                        };

                        if(isContentScrollable()) {
                            if (!up && -delta > scrollHeight - height - scrollTop) {
                                // Scrolling down, but this will take us past the bottom.
                                element.scrollTop(scrollHeight);
                                return prevent();
                            } else if (up && delta > scrollTop) {
                                // Scrolling up, but this will take us past the top.
                                element.scrollTop(0);
                                return prevent();
                            }
                        }
                    });

                    function isContentScrollable() {
                        return element.get(0).scrollHeight > element.innerHeight();
                    }
                }
            };
        });

}());
