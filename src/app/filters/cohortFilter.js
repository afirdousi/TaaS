(function() {
    'use strict';

    var mainApp = angular.module('mainApp');

    mainApp.filter('cohortFilter', [
        function() {
            return function(input,group) {
                if(input) {
                    if(group.Group === "Cohort") {
                        
                        input = _.filter(input,function(d){
                          return d.attributeValue  !== "no" ;
                        
                        });
                        //console.log(JSON.stringify(input,null,4));
                        
                    }

                }
                return input;
            };
        }
    ]);

})();