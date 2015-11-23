/*jshint -W069 */
(function() {
    'use strict';

    var isSessionStorageAvailable = false;

    angular
        .module('mainApp')
        .service('sessionStorage', [
            '$window',
            SessionStorageService
        ]);

    function SessionStorageService($window) {

        isSessionStorageAvailable = supportsSessionStorage();
        if(isSessionStorageAvailable) {
            this.sessionStorage = $window.sessionStorage;
        }

        function supportsSessionStorage() {
            try {
                return 'sessionStorage' in $window && $window['sessionStorage'] !== null;
            } catch (e) {
                return false;
            }
        }
    }

    SessionStorageService.prototype = {

        get isAvailable() {
            return isSessionStorageAvailable;
        },

        setItem: function(name, value) {
            var jsonData;
            if(isSessionStorageAvailable) {
                if(!name || !_.isString(name)) {
                    throw new Error("Name must be supplied for session storage.");
                }
                if(_.isUndefined(value) || _.isNull(value)) {
                    this.sessionStorage.removeItem(name);
                }
                else {
                    jsonData = JSON.stringify(value);
                    this.sessionStorage.setItem(name, jsonData);
                }
            }
        },

        getItem: function(name) {
            var jsonText;
            if(isSessionStorageAvailable) {
                if (!name || !_.isString(name)) {
                    throw new Error("Name must be supplied for session storage.");
                }
                jsonText = this.sessionStorage.getItem(name);
                return JSON.parse(jsonText);
            }
        },

        removeItem: function(name) {
            if(isSessionStorageAvailable) {
                if (!name || !_.isString(name)) {
                    throw new Error("Name must be supplied for session storage.");
                }
                this.sessionStorage.removeItem(name);
            }
        },

        clearAll: function() {
            if(isSessionStorageAvailable) {
                this.sessionStorage.clear();
            }
        }

    };

})();
