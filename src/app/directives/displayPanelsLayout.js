(function() {

    'use strict';

    var layoutDelayTime = 650;
    var controlTemplates = {

        expandedMode: '<button class="btn" title="Show panel full screen." ng-click="vm.toggleExpandedMode()">' +
            '<i class="fa fa-expand"></i>' +
            '</button>',

        collapse: '<button class="btn" title="Collapse/expand panel." ng-click="vm.toggleCollapsed()" ng-disabled="vm.panelStates.isExpandedMode">' +
            '<i class="fa" ng-class="vm.panelStates.collapsedIcon"></i>' +
            '</button>',
        showMore : '<a href="" class="showMore" title="Show All." ng-click="vm.toggleExpandedMode()" ng-hide="vm.panelStates.isExpandedMode">' +
            'Show All</a>'
    };

    angular
        .module('mainApp')
        .directive('shcDisplayPanelsLayout', [
            function() {
                return {
                    restrict: 'A',
                    controller: [
                        '$element',
                        '$scope',
                        '$timeout',
                        'panelStates',
                        DisplayPanelsLayoutCtrl
                    ]
                };
            }])
        .directive('shcDisplayPanel', [
            '$compile',
            '$timeout',
            function($compile, $timeout) {
                return {
                    restrict: 'A',
                    scope: {
                        disableExpandedMode: '=',
                        disableCollapse: '='
                    },
                    controller: [
                        '$element',
                        DisplayPanelCtrl
                    ],
                    controllerAs: 'vm',
                    bindToController: true,
                    require: ['^shcDisplayPanelsLayout', 'shcDisplayPanel'],
                    link: function(scope, element, attrs, ctrls) {

                        var parentCtrl = ctrls[0];
                        var thisCtrl = ctrls[1];
                        var headerDiv, controlsDiv, bottomCntrlDiv, footerDiv;

                        angular.extend(thisCtrl, {
                            toggleMasonry: parentCtrl.toggleMasonry.bind(parentCtrl),
                            performLayout: parentCtrl.performLayout.bind(parentCtrl)
                        });

                        headerDiv = element.find("header");
                        footerDiv = element.find("footer");
                        if(headerDiv.length !== 1) {
                            throw new Error("Could not find a header element to append panel controls to.");
                        }

                        controlsDiv = angular.element("<div class='controls'></div>");
                        bottomCntrlDiv = angular.element("<div class='show-more'></div>");
                        
                        if(!scope.disableCollapse) {
                            controlsDiv.append(controlTemplates.collapse);
                        }
                        if(!scope.disableExpandedMode) {
                            controlsDiv.append(controlTemplates.expandedMode);
                            bottomCntrlDiv.append(controlTemplates.showMore);
                        }

                        headerDiv.append(controlsDiv);
                        footerDiv.append(bottomCntrlDiv);
                        $compile(controlsDiv)(scope);
                        $compile(bottomCntrlDiv)(scope);

                        // For ng-repeat, look for $last property on scope
                        // and reset the masonry plugin.
                        if(scope.$parent && scope.$parent.$last) {
                            $timeout(function() {
                                parentCtrl.resetMasonry();
                            });
                        }

                        // When the panel resizes, make sure a layout operation is performed
                        element.resize(_.debounce(function() {
                            thisCtrl.performLayout();
                        }, 500));

                        // Disable expanded mode if panel is being destroyed
                        scope.$on('$destroy', function() {
                            if(thisCtrl.panelStates.isExpandedMode) {
                                thisCtrl.toggleMasonry();
                            }
                        });

                        // Expand while click on Show more link
                        scope.$on('expandJarvisWidget', function() {
                            parentCtrl.toggleExpandedMode();
                        });
                    }
                };
            }]);

    function DisplayPanelsLayoutCtrl($element, $scope, $timeout, panelStates) {

        var self = this;
        self.element = $element;
        self.$timeout = $timeout;
        self.isEnabled = false;

        self.element.addClass('display-panels');
        self.enableMasonry();

        $scope.$watch(
            function() {
                // Create a "change key" to watch
                return [
                    panelStates.isAttributesPanelOpen,
                    panelStates.isFiltersPanelOpen,
                    panelStates.isFiltersPanelExpanded
                ].join(" ");
            },
            function() {
                // When the "change key" has changed, then perform the layout
                // Allow time for the animation to complete
                self.performDelayedLayout();
            }
        );
    }

    DisplayPanelsLayoutCtrl.prototype = {

        enableMasonry: function() {
            if(!this.isEnabled) {
                this.isEnabled = true;
                this.element.masonry({
                    isFitWidth: true
                });
            }
        },

        disableMasonry: function() {
            if(this.isEnabled) {
                this.isEnabled = false;
                this.element.masonry('destroy');
            }
        },

        resetMasonry: function() {
            if(this.isEnabled) {
                this.disableMasonry();
            }
            this.enableMasonry();
        },

        toggleMasonry: function() {
            if(this.isEnabled) {
                this.element.addClass('is-expanded-mode');
                this.disableMasonry();
            }
            else {
                this.element.removeClass('is-expanded-mode');
                this.enableMasonry();
            }
        },

        performLayout: function() {
            if(this.isEnabled) {
                this.element.masonry();
            }
        },

        performDelayedLayout: function() {
            var self = this;
            self.$timeout(function () {
                self.performLayout();
            }, layoutDelayTime);
        }
    };

    function DisplayPanelCtrl($element) {

        this.element = $element;
        this.panelStates = {
            isCollapsed: false,
            isExpandedMode: false,
            get collapsedIcon() {
                return this.isCollapsed ? "fa-plus" : "fa-minus";
            }
        };
    }

    DisplayPanelCtrl.prototype = {

        toggleExpandedMode: function() {
            if(this.panelStates.isExpandedMode) {
                this.element.removeClass("is-expanded-mode");
                this.panelStates.isExpandedMode = false;
            }
            else {
                this.element.addClass("is-expanded-mode");
                this.element.removeClass("is-collapsed");
                this.panelStates.isCollapsed = false;
                this.panelStates.isExpandedMode = true;
            }
            this.toggleMasonry();
        },

        toggleCollapsed: function() {
            if(this.panelStates.isCollapsed) {
                this.element.removeClass("is-collapsed");
                this.panelStates.isCollapsed = false;
            }
            else {
                this.element.addClass("is-collapsed");
                this.panelStates.isCollapsed = true;
            }
            this.performLayout();
        },

        toggleMasonry: _.noop,
        performLayout: _.noop
    };

}());
