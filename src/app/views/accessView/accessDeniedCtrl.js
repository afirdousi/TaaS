(function(){

"use strict";

 angular
        .module('mainApp')
        .controller('accessDeniedCtrl', [
            'panelStates',
            AccessDeniedCtrl
        ]);

    function AccessDeniedCtrl(panelStates) {

        this.panelStates = panelStates;

    }

    AccessDeniedCtrl.prototype = {

        gotoLogin:function(){
            this.panelStates.$state.go('app.login');
        }

    };

}());
