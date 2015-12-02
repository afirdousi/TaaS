(function() {
    'use strict';

    var dumpAttributeInfo = false;

    angular
        .module('mainApp')
        .service('testerProfileService', [
            '$http',
            '$log',
            TesterProfileService
        ]);

    function TesterProfileService($http, $log) {
        this.$http = $http;
        this.$log = $log;
    }

    TesterProfileService.prototype = {

        getFullProfile: function() {
            return this.$http({
                method: 'GET',
                url: 'api/tester/fullprofile',  // 'taas' should not be hardcoded and should come from 'this.appConfig.contextRoot'
                cache: true
            }).then(function(result) {
                //console.log(result);
                return result.data;
            });
        }

    };

})();
