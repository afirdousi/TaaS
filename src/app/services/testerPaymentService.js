(function() {
    'use strict';

    var dumpAttributeInfo = false;

    angular
        .module('mainApp')
        .service('testerPaymentService', [
            '$http',
            '$log',
            TesterPaymentService
        ]);

    function TesterPaymentService($http, $log) {
        this.$http = $http;
        this.$log = $log;
    }

    TesterPaymentService.prototype = {

        getFullPayment: function() {
            return this.$http({
                method: 'GET',
                url: 'api/tester/fullpayment',  // 'taas' should not be hardcoded and should come from 'this.appConfig.contextRoot'
                cache: true
            }).then(function(result) {
                return result.data;
            });
        }

    };

})();
