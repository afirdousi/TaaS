/**
 * Created by afirdou on 6/16/2015.
 */
(function() {

    'use strict';

    angular
        .module('mainApp')
        .directive('shcAdvanceSearchEntry', [
            '$rootScope',
            'advanceSearchEntry',
            function ($rootScope) {
                return {
                    restrict: 'A',
                    require: 'ngModel',
                    scope:{
                      hasFocus:'=',
                        someOtherAtt:'='
                    },
                    link: function (scope, element, attrs, ctrl) {

                        element.bind('focus',searchEntryFocus);
                        element.bind('blur',function(){

                                        console.log('SEARCH ENTRY : BLUR');
                                        scope.vmSearchEntry.hasFocus = false;


                                        ctrl.$setViewValue

                                    });

                        element.bind('keydown',searchEntryKeyDown);
                        element.bind('keypress',searchEntryKeyPress);
                        element.bind('keyup',searchEntryKeyUp);


                        function searchEntryKeyDown(){

                        }

                        function searchEntryKeyPress(){

                        }

                        function searchEntryKeyUp(){

                        }

                        function searchEntryFocus(){

                            scope.vmSearchEntry.hasFocus = false;
                        }

                        function searchEntryBlur(){
                            scope.hasFocus=false ;
                        }


                    }



                }
            }
        ]
    );




})();