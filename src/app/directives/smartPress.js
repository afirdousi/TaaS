(function() {

   'use strict';

    angular
        .module('mainApp')
        .directive('smartPress', [
            '$rootScope',
            'attributeList',
            function($rootScope, attributeList) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, ctrl) {
                element.bind("keydown keypress", function (event) {

                  if(event.keyCode === 27 || event.keyCode === 8){

                       if(attributeList.topSearchNoValue != undefined && attributeList.topSearchNoValue === true){
    
                            $rootScope.$broadcast('cleanMainSearchInput');
                      }
                    
                  }

                });
               
            }
             
         
          };
         
      }]).directive('smartAlertClick', [
            '$rootScope',
            function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, ctrl) {
                   element.bind("click", function (){

                           $rootScope.$broadcast('cleanMainSearchInput');
                      
                });
               
            }
             
         
          };
         
      }])

}());
