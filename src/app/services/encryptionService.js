/**
 * Created by afirdou on 4/15/2015.
 */

(function() {
    'use strict';


    angular
        .module('mainApp')
        .service('encryptMessage', ['CryptoJS',
            EncryptMessageService
        ]);

    function EncryptMessageService(CryptoJS) {
        this.CryptoJS = CryptoJS;
    }

    EncryptMessageService.prototype = {

        encrypt: function (credentials) {

            var encrypted = this.CryptoJS.TripleDES.encrypt(credentials, "SEARSKEY");
            return encrypted;
        }

    };


 /*   angular.module('mainApp')
        .factory('encryptMessage', function () {
            return {
                encrypt: function (value) {
                    //var str = JSON.stringify(value);
                    console.log(value);
                    var encrupted = CryptoJS.TripleDES.encrypt(value);
                    console.log('encryptMessage Service : '  + encrupted);
                    return CryptoJS.TripleDES.encrypt(value);
                }
            };
        });*/

})();


