/*jshint -W069 */
(function() {
    'use strict';

    var isLocalStorageAvailable = false;

    angular
        .module('mainApp')
        .service('localStorage', [
            '$window',
            LocalStorageService
        ]);

    function LocalStorageService($window) {

        isLocalStorageAvailable = supportsLocalStorage();
        if(isLocalStorageAvailable) {
            this.localStorage = $window.localStorage;
        }

        function supportsLocalStorage() {
            try {
                return 'localStorage' in $window && $window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        }
    }

    LocalStorageService.prototype = {

        get isAvailable() {
            return isLocalStorageAvailable;
        },

        setItem: function(name, value) {
            var jsonData;
            if(isLocalStorageAvailable) {
                if(!name || !_.isString(name)) {
                    throw new Error("Name must be supplied for local storage.");
                }
                if(_.isUndefined(value) || _.isNull(value)) {
                    this.localStorage.removeItem(name);
                }
                else {
                    jsonData = JSON.stringify(value);
                    this.localStorage.setItem(name, jsonData);
                }
            }
        },

        getItem: function(name) {
            var jsonText;
            if(isLocalStorageAvailable) {
                if (!name || !_.isString(name)) {
                    throw new Error("Name must be supplied for local storage.");
                }
                jsonText = this.localStorage.getItem(name);
                return JSON.parse(jsonText);
            }
        },

        removeItem: function(name) {
            if(isLocalStorageAvailable) {
                if (!name || !_.isString(name)) {
                    throw new Error("Name must be supplied for local storage.");
                }
                this.localStorage.removeItem(name);
            }
        },

        clearAll: function() {
            if(isLocalStorageAvailable) {
                this.localStorage.clear();
            }
        }

    };

})();
