(function() {

    "use strict";

    angular
        .module('mainApp')
        .controller('configurationViewCtrl', [
            '$rootScope',
            '$scope',
            'configService',
            'attributeList',
            ConfigurationViewCtrl
        ]);

    function ConfigurationViewCtrl($rootScope, $scope, configService, attributeList) {

        var self = this;
        this.configService = configService;
        this.attributeList = attributeList;
        

        this.groupsList = [];
        this.interactionsList = [];
        this.hideInteractionsWithNoResults = false;



       // this._readConfig();
    }

    ConfigurationViewCtrl.prototype = {        

        _readConfig: function() {
            var self = this;
            var findIconClass = function(groupName) {
                var group = self.attributeList.findGroup(groupName);
                return group ? group.iconClass : "";
            };
            self.attributeList
                .afterAttributesLoaded()
                .then(function() {
                    self.configService
                        .getCurrent()
                        .then(function(config) {

                            config.groups = config.groups || [];
                            config.interactions = config.interactions || [];

                            self.hideInteractionsWithNoResults = !!config.hideInteractionsWithNoResults;

                            self.groupsList = _.map(config.groups, function(g) {
                                g = _.cloneDeep(g);
                                g.iconClass = findIconClass(g.groupName);
                                return g;
                            });

                            self.interactionsList = _.map(config.interactions, function(i) {
                                i = _.cloneDeep(i);
                                return i;
                            });

                        });
                });
        },

        onConfigUpdated: _.debounce(function() {
            this._updateConfig();
        }, 2000, {
            leading: false,
            trailing: true
        }),

        _updateConfig: function() {
            var self = this;
            self.configService
                .getCurrent()
                .then(function(config) {

                    config.hideInteractionsWithNoResults = self.hideInteractionsWithNoResults;

                    config.groups = _.map(self.groupsList, function(g) {
                        return {
                            groupName: g.groupName,
                            displayGroup: g.displayGroup,
                            removeWidget: g.removeWidget
                        };
                    });

                    config.interactions = _.map(self.interactionsList, function(i) {
                        return {
                            name: i.name,
                            displayInteraction: i.displayInteraction
                        };
                    });

                    self.configService.saveConfig();
                });
        },

        restoreDefault: function() {
          /*  this.configService.restoreDefaultConfig();
            this._readConfig();*/
        }
    };

}());
