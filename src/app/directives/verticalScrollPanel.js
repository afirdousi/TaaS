(function() {

    'use strict';

    angular
        .module('mainApp')
        .directive('shcVerticalScrollPanel', [
            '$interval',
            function($interval) {
                return {
                    restrict: 'A',
                    transclude: true,
                    controller: [
                        '$scope',
                        VerticalScrollPanelCtrl
                    ],
                    scope: {
                        onToggleButtonClicked: '&',
                        isPanelOpen: '=',
                        isPanelDisabled: '='
                    },
                    templateUrl: 'app/directives/views/verticalScrollPanelTemplate.html',
                    link: function(scope, element) {

                        var contentPanel = element.find(".vertical-scroll-content > :nth-child(1)");
                        var scrollIntervalPromise = null;
                        var lastScrollableStatus = null;
                        var updateIntervalPromise = $interval(configureScrollButtons, 500);

                        contentPanel.perfectScrollbar();

                        configureScrollButtons();
                        scope.$on('$destroy', function() {
                            $interval.cancel(updateIntervalPromise);
                            cancelScroll();
                            contentPanel.perfectScrollbar('destroy');
                        });

                        handleMouseEvents(".vertical-scroll-buttons > :nth-child(1)", -10);
                        handleMouseEvents(".vertical-scroll-buttons > :nth-child(2)", 10);

                        function handleMouseEvents(buttonSelector, offs) {
                            var scrollBtn = element.find(buttonSelector);
                            scrollBtn.on('mousedown', function(evt) {
                                evt.preventDefault();
                                scrollBtn.on('mouseleave', cancelEvents);
                                scrollBtn.on('mouseup', cancelEvents);
                                scrollIntervalPromise = $interval(scrollContent, 15);
                                function scrollContent() {
                                    contentPanel.scrollTop(contentPanel.scrollTop() + offs);
                                    contentPanel.perfectScrollbar('update');
                                }
                                function cancelEvents() {
                                    scrollBtn.off('mouseleave', cancelEvents);
                                    scrollBtn.off('mouseup', cancelEvents);
                                    cancelScroll();
                                }
                            });
                        }

                        function cancelScroll() {
                            if(scrollIntervalPromise) {
                                $interval.cancel(scrollIntervalPromise);
                                scrollIntervalPromise = null;
                            }
                        }

                        function isContentScrollable() {
                            return contentPanel.get(0).scrollHeight > contentPanel.innerHeight();
                        }

                        function configureScrollButtons() {
                            var currentScrollableStatus = isContentScrollable();
                            if(lastScrollableStatus !== currentScrollableStatus) {
                                if (currentScrollableStatus) {
                                    element.removeClass('scrolling-disabled');
                                }
                                else {
                                    element.addClass('scrolling-disabled');
                                }
                                lastScrollableStatus = currentScrollableStatus;
                            }
                        }
                    }
                };
            }]);

    function VerticalScrollPanelCtrl($scope) {
        this.$scope = $scope;
        this.$scope.contentPanelStyle = {
            width: "100%"
        };
    }

    VerticalScrollPanelCtrl.prototype = {

        setContentPanelWidth: function(width) {
            this.$scope.contentPanelStyle.width = width || "100%";
        }

    };

}());

