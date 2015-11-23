(function() {

    'use strict';

    angular
        .module('mainApp')
        .service('panelStates', [
            '$q',
            '$state',
            '$rootScope',
            '$timeout',
            'schemaService',
            'configService',
            PanelStates
        ]);

    function PanelStates($q, $state, $rootScope, $timeout, schemaService, configService) {

        var self = this;

        this.$q = $q;
        this.$state = $state;
        this.$timeout = $timeout;
        this.schemaService = schemaService;
        this.configService = configService;

        this._isAttributesPanelOpen = true;
        this._isFiltersPanelOpen = false;
        this.isAttributesPanelRemoved = false; // Toggles when Saved Search Opens
        this.isFilterPanelRemoved = false; // Toggles when Saved Search Opens

        this.profileGroups = [];
        this.interactionViews = [];
        this.interactionGroups = [];
        this.cohortSegmentGroups = [];

        this.onInteractionsViewChanged = function() {
            var selectedView = self.selectedInteractionsView;
            if(selectedView) {
                $rootScope.$emit('interactions-view-changed', selectedView);
            }
        };

        this.onSalesandTransViewChanged = function() {
            var selectedView = self.selectedSalesandTransView;
            if(selectedView) {
                $rootScope.$emit('SalesandTrans-view-changed', selectedView);
            }
        };


        this._panelInfoDeferred = $q.defer();

        this._initializeGroupInfo();
    }

    PanelStates.prototype = {

        _initializeGroupInfo: function () {
        },

        togglePanels: function() {

            if(this.isSavedSearchView) {
                return;
            }

            if(this.isScheduleView) {
                // this.isFiltersPanelOpen = !this.isFiltersPanelOpen;
                return;
            }

            if(this.hasExpression) {
                if(this.isAttributesPanelOpen !== this.isFiltersPanelOpen) {
                    this.isAttributesPanelOpen = this.isFiltersPanelOpen = true;
                }
                else {
                    this.isAttributesPanelOpen = this.isFiltersPanelOpen = !this.isFiltersPanelOpen;
                }
            }
            else {
                this.isAttributesPanelOpen = !this.isAttributesPanelOpen;
            }
        },

        get isAttributesPanelOpen() {
            return this._isAttributesPanelOpen;
        },
        set isAttributesPanelOpen(value) {
            this._isAttributesPanelOpen = !!value;
        },
        get isFiltersPanelOpen() {
            return this._isFiltersPanelOpen;
        },
        set isFiltersPanelOpen(value) {
            this._isFiltersPanelOpen = !!value;
        },

        get isFiltersPanelExpanded() {
            return this.isFiltersPanelOpen;
        },
        set isFiltersPanelExpanded(value) {
            // do nothing ...
        },

        get hasExpression() {
            return false;
        },

        get isSavedSearchView() {
            return this.$state.is('app.savedSearch');
        },
        get isScheduleView() {
            return this.$state.is('app.schedule');
        },


        get selectedInteractionsView() {
            return _.find(this.interactionViews, function(v) {
                return v.isActiveView;
            });
        },

        onPanelInfoLoaded: function() {
            return this._panelInfoDeferred.promise;
        }


    };

}());
