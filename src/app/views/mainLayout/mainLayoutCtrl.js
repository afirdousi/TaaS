 $(document).keydown(function(e) {
            if(e.keyCode === 8 && e.target.localName !== "input"){
                e.preventDefault();
            }
         });     
(function() {

    "use strict";

    angular
        .module('mainApp')
        .controller('mainLayoutCtrl', [
            '$state',
            'panelStates',
            '$rootScope',
            'AUTH_EVENTS',
            '$interval',
            'AuthService',
            'AuthServiceState',
            MainLayoutCtrl
        ]);

    function MainLayoutCtrl($state, panelStates,$rootScope,AUTH_EVENTS,$interval,AuthService,AuthServiceState) {
        this.$state = $state;
        this.panelStates = panelStates;
        this.rootScope=$rootScope;
        this.currentUser='';   
        this.AUTH_EVENTS = AUTH_EVENTS;
        this.$interval = $interval;
        this.authService = AuthService;

        this.authServiceState = AuthServiceState;

        //Global Flag for SAVED SEARCH EDIT MODE
        this.isSavedSearchEditModeGlobal = false;
        this.editSavedSearchTitleGlobal = '';
        this.isAppDown = false;

        console.log();

    }

    MainLayoutCtrl.prototype = {

        get headerShouldBeVisible(){
            return this.$state.current.name !="app.www";
        },

        get filterCount() {
            if(this.commonQuery.filterQuery.parts.length===0)
            {
                this.panelStates.isFiltersPanelOpen=false;
            }
             return this.commonQuery.filterQuery.parts.length;
        },

        get isFiltersPanelEnabled() {
            return this.commonQuery.currentQuery.hasExpression || this.$state.is('app.schedule');
        },

        get removeAttributesPanel() {
            return this.panelStates.isAttributesPanelRemoved;
        },
        get removeFilterPanel() {
            return this.panelStates.isFilterPanelRemoved;
        },
        get hideAttributesPanel() {
            return !this.panelStates.isAttributesPanelOpen;
        },

        get hideFiltersPanel() {
            return !this.panelStates.isFiltersPanelOpen;
        },

        get showExpandedFiltersPanel() {
            return this.panelStates.isFiltersPanelOpen && this.panelStates.isFiltersPanelExpanded;
        },

        toggleAttributesPanelState: function() {
            this.panelStates.isAttributesPanelOpen = !this.panelStates.isAttributesPanelOpen;
        },

        toggleFiltersPanelState: function() {
            this.panelStates.isFiltersPanelOpen = !this.panelStates.isFiltersPanelOpen;
        }
        
    };

}());
