(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('pageSubHeaderCtrl', [
            '$rootScope',
            'smartMessageBox',
            'localStorage',
            'panelStates',
            'AuthService',
            'AuthServiceState',
            'AUTH_EVENTS',
            '$state',
            '$q',
            '$timeout',
            PageSubHeaderCtrl
        ]).
        directive('select',
            HackedSelect);

    function HackedSelect() {
        return {
            restrict: 'E',
            require: '?ngModel',
            link: function(scope, element, attr, ngModelCtrl) {
                if (ngModelCtrl) {
                    ngModelCtrl.$isEmpty = function(value) {
                        return !value || value.length === 0;
                    }
                }
            }
        }
    };

    function PageSubHeaderCtrl($rootScope, smartMessageBox, localStorage, panelStates,AuthService,AuthServiceState,AUTH_EVENTS, $state,$q,$timeout) {

        var self=this;
        this.$rootScope = $rootScope;
        this.smartMessageBox = smartMessageBox;
        this.localStorage = localStorage;
        this.panelStates = panelStates;
        /*this.queryEditerService = queryEditerService;*/
        this.AuthService = AuthService;
        this.authServiceState = AuthServiceState;
        this.AUTH_EVENTS = AUTH_EVENTS;
        this.isSaveSearchPanelOpen  =false;
        this.$state = $state;
        this.businessInitiativeLst = [];
        this.$q = $q;
        this.hasSessionExpired = false;
        this.isAppDown = false;
        this.clickedAdmin = false;
        this.$timeout = $timeout;

        this.filterIMV = "";



        $rootScope.$on('JWT_NODE_SESSION_EXPIRED',function(){
            //console.log("JWT_NODE_SESSION_EXPIRED caught from Page Sub Header!!!!!");
            self.hasSessionExpired = true;
            self.isAppDown = true;
            self.maintenanceMessage ='Your session has expired. Please logout and log back in again.';

            self.$timeout(function(){
                self.hasSessionExpired = false;
                self.isAppDown = false;
                self.maintenanceMessage='';
                self.AuthService.logout();
            },5000);


        });

    }

    PageSubHeaderCtrl.prototype = {

        get userName() {
            return this.authServiceState.currentUserName;
        },
        toggleExpandedFiltersPanel: function() {
            if(this.$state.current.name!="app.savedSearch"){
                this.panelStates.isAttributesPanelRemoved = false;
                this.panelStates.isFilterPanelRemoved = false;
            }
        },
        get isSecure() {
            return this.authServiceState.isAuthenticated();
        },
        logout:function() {
            //this.commonQuery.filterQuery.removeAll();
            this.AuthService.logout();
        },

        clickAdmin:function() {
            var arrow = angular.element(document.getElementById('admin-rotate-caret'));
            if(!this.clickedAdmin) {
                arrow.css('animation-name', 'admin-rotate-caret-down');
                arrow.css('transform', 'rotate(90deg)');
            } else {
                arrow.css('animation-name', 'admin-rotate-caret-up');
                arrow.css('transform', 'rotate(0deg)');
            }
            this.clickedAdmin = !this.clickedAdmin;
        },


        verifyAndResetLocalStorage: function() {
            var self = this;
            self.smartMessageBox({
                title : "<i class='fa fa-refresh' style='color:green'></i> Reset to Default Layout",
                content : "Would you like to RESET your configuration to the default layout?",
                buttons : '[No][Yes]'
            }, function(buttonPressed) {
                if (buttonPressed === "Yes") {
                    self.localStorage.clearAll();
                    self.$window.location.reload();
                }
            });
        }




    };

})();
