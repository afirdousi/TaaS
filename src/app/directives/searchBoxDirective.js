(function() {

   'use strict';

    angular
        .module('mainApp')
        .directive('searchBoxDirective', [
            '$rootScope',
            '$timeout',
            function($rootScope, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {

                $rootScope.$on('OperatorRequired', function() {                  
                    $timeout(function() {
                       ctrl.$setViewValue(' ');
                       ctrl.$render();
                    });
                });

                $rootScope.$on('ValueRequired', function() {                  
                    $timeout(function() {
                       ctrl.$setViewValue(' ');
                       ctrl.$render();
                    });
                    
                });
               
                
                element.bind("keydown keypress", function (event) {

                  if(event.keyCode === 27){
                    
                        scope.vmEntry.cleanMainSearchInput();
                        return;
                  }

                  if(scope.vmEntry.currentState === scope.vmEntry.parseStates.filter){

                      // No keystroke works except ENTER and BACKSPACE
                      if(event.keyCode !== 8 && event.keyCode !== 13 ){
                        event.preventDefault();
                        return;
                      }



                  }
                
                  if(scope.vmEntry.currentState === scope.vmEntry.parseStates.attr){

                    //Press Enter,Space,Backspace, Downarrow key
                    if(event.keyCode === 13 || event.keyCode === 40 || event.keyCode === 8){
                      if(element[0].value === ''){
                        ctrl.$setViewValue('A');
                        ctrl.$render();
                        element.val('');
                        element.next().scope().position.left = 48;

                      }
                    }

                    
                  } else if(scope.vmEntry.currentState === scope.vmEntry.parseStates.operator){

                    if(element[0].value === '' && event.keyCode === 8) {


                      scope.$apply(function() {

                          scope.vmEntry.currentInputTags =[]; 
                          scope.vmEntry.msg = scope.vmEntry.placeHolderMessages[0];                        
                          scope.vmEntry.currentState = scope.vmEntry.parseStates.attr;
                          scope.vmEntry.getSuggestions('');
                      });

                    }

                    if(event.keyCode === 40){
                       
                        scope.$apply(function() {
                            ctrl.$setViewValue(' ');
                             ctrl.$render();
                        });
                     }

                  } else if(scope.vmEntry.currentState === scope.vmEntry.parseStates.value) {

                    if(element[0].value === '' && event.keyCode === 8) {

                        scope.$apply(function() {

                          scope.vmEntry.currentInputTags.pop();
                          scope.vmEntry.msg = scope.vmEntry.placeHolderMessages[1];
                          scope.vmEntry.currentState = scope.vmEntry.parseStates.operator;

                          scope.vmEntry.getSuggestions('');

                       });

                    }

                     if(event.keyCode === 40){
                       
                        scope.$apply(function() {
                            ctrl.$setViewValue(' ');
                             ctrl.$render();
                        });
                     }

                  } else if(scope.vmEntry.currentState === scope.vmEntry.parseStates.filter){

                    if(event.keyCode===13){  // detecting 'enter' key to add filter Condition on enterkey

                      if(scope.canAdd){
                          scope.vmEntry.addCondition();
                          scope.canAdd= false;
                        } else {
                          scope.canAdd= true;
                        }
                    } else if(event.keyCode===8){

                             scope.$apply(function() {

                                 scope.vmEntry.currentInputTags.pop();
                                 scope.vmEntry.msg = scope.vmEntry.placeHolderMessages[2];
                                 scope.vmEntry.currentState = scope.vmEntry.parseStates.value;

                          ctrl.$render();

                       });

                    }

                  }

                });
               
            }
             
         
          };
         
      }]);

}());
