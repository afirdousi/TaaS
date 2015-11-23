(function() {
    'use strict';

    var mainApp = angular.module('mainApp');

    mainApp.filter('segmentFilter', [
        function() {
            return function(input,group) {
                if(input) {
                     if(group.Group === "SYW Segments" || group.Group === "VAPP Segments" || group.Group === "Charitable Givings" || group.Group === "MRC Segments" ) {

                        input = _.filter(input,function(d){
                            d.attributeName = "";
                            return d ;

                        });
                        //console.log(JSON.stringify(input,null,4));

                    }
                }
                return input;
            };
        }
    ])
    .filter('orderByReportAttribute', [
        function() {
            return function(items, orderBy, reverseOrder) {
                if(items && items.length > 0 && items[0][orderBy] != undefined ){
                  items =  _.sortBy(items, function(o) { return o[orderBy].value; });

                   if(reverseOrder){
                        items.reverse(); 
                    }
                }
               
               
                return items;
            };
        }
    ])

})();