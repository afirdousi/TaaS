(function() {
    'use strict';

    // To be used to migrate configuration
    var currentStorageVersion = 8;

    var configStorageName = "config.default";
    var currentConfigDeferred;

    angular
        .module('mainApp')
        .service('configService', [
            '$q',
            '$rootScope',
            'schemaService',
            'localStorage',
            ConfigService
        ]);

    function ConfigService($q, $rootScope, schemaService, localStorage) {
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.schemaService = schemaService;
        this.localStorage = localStorage;
        //this._initializeConfig();
    }

    ConfigService.prototype = {

        _initializeConfig: function() {

            currentConfigDeferred = this.$q.defer();

            var storedConfig = this.localStorage.getItem(configStorageName);
            this._createDefaultConfig()
                .then(function(data) {
                    if(storedConfig) {
                        if(storedConfig.storageVersion === currentStorageVersion) {
                            data = storedConfig;
                        }
                    }
                    currentConfigDeferred.resolve(data);
                }, function(err) {
                    currentConfigDeferred.reject(err);
                });
        },

        _createDefaultConfig: function() {
            return this.$q.all([
                this.schemaService.getGroups(),
                this.schemaService.getInteractions(),
                this.schemaService.getBreakdowns()
            ]).then(function(data) {
                var groups = data[0];
                var interactions = data[1];
                var breakdowns = data[2].defaults || [];
                var enabledInteractions = [
                    "Follow",
                    "Like",
                    "Add To Catalog",
                    "Want"
                ];
                return {
                    storageVersion: currentStorageVersion,
                    groups: _.map(groups, function(g) {
                        return {
                            groupName: g.Group,
                            displayGroup: angular.isUndefined(g.hideWidget) ? true : !g.hideWidget,
                            removeWidget: g.removeWidget
                        };
                    }),
                    interactions: _(interactions.Breakdowns)
                        .filter(function(i) {
                            return !i.Hide;
                        })
                        .map(function(i) {
                            return {
                                name: i.Name,
                                displayInteraction: _.some(enabledInteractions, function(ei) {
                                    return i.Name === ei;
                                })
                            };
                        })
                        .value(),
                    breakdowns: breakdowns
                };
            });
        },

        _onConfigUpdated: function() {
            this.$rootScope.$emit('config-updated');
        },

        getCurrent: function() {
            return currentConfigDeferred.promise;
        },

        restoreDefaultConfig: function() {
            this.localStorage.removeItem(configStorageName);
            this._initializeConfig();
        },

        saveConfig: function() {
            var self = this;
            self.getCurrent().then(function(config) {
                self.localStorage.setItem(configStorageName, config);
                self._onConfigUpdated();
            });
        },

        hideProfileGroup: function(groupName) {
            var self = this;
            self.getCurrent().then(function(config) {
                var group = _.find(config.groups, function(g) {
                    return g.groupName === groupName;
                });
                if(group) {
                    group.displayGroup = false;
                    self.saveConfig();
                }
            });
        },

        hideInteractionsGroup: function(groupName) {
            var self = this;
            self.getCurrent().then(function(config) {
                var group = _.find(config.interactions, function(g) {
                    return g.name === groupName;
                });
                if(group) {
                    group.displayInteraction = false;
                    self.saveConfig();
                }
            });
        },

        getMonthArray: function() {
            
            return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        }
      
    
    };

})();
