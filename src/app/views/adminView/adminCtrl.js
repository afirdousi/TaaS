(function(){

"use strict";

 angular
        .module('mainApp')
        .controller('adminCtrl', [
            AdminCtrl
        ]);

    function AdminCtrl() {
        this.selectedView = 1;
    }

    AdminCtrl.prototype = {

        get isAddUserView(){
            return this.selectedView === 1;
        },

        get isUpdateUserView(){
            return this.selectedView === 2;
        },

        get isSolrConfigView(){
            return this.selectedView === 3;
        },

        get isMaintenanceView(){
            return this.selectedView === 4;
        },

        selectAddUser: function(){
            this.selectedView = 1;
        },

        selectUpdateUser: function(){
            this.selectedView = 2;
        },

        selectSolrConfig: function(){
            this.selectedView = 3;
        },
        selectMaintenance:function(){
            this.selectedView = 4;
        }
    };

}());