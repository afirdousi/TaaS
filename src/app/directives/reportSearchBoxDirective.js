(function() {

   'use strict';

    angular
        .module('mainApp')
        .directive('reportSearchBox', [
            '$rootScope',
            function($rootScope) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                element.bind("keydown keypress", function (event) {
                    scope.vmreport.loadDefaultReportDropDown();
                    if(event.keyCode === 13 || event.keyCode === 40 || event.keyCode === 8){
                       if(element[0].value === ''){
                          ctrl.$setViewValue('A');
                          ctrl.$render();

                        }
                      }
                  });
               
            }
             
         
          };
         
      }]);

}());
