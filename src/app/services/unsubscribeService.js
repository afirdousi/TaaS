(function() {
    'use strict';

    angular
        .module('mainApp')
        .service('unsubscribeService', [
            UnsubscribeService
        ])
        .service('pubSub', [
            '$rootScope',
            PubSubService
        ]);

    function UnsubscribeService() {
    }

    UnsubscribeService.prototype = {

        unsubscribe: function(scope, offMethods) {
            var list = offMethods.slice();
            var scopeOffMethod = scope.$on('$destroy', function() {
                _.each(list, function(offMethod) {
                    offMethod();
                });
            });
            list.push(scopeOffMethod);
        }
    };

    function PubSubService($rootScope) {
        this.$rootScope = $rootScope;
    }

    PubSubService.prototype = {

        publish: function(name, state) {
            this.$rootScope.$emit(name, state);
        },

        subscribe: function(scope, subscribers) {
            var $rootScope = this.$rootScope;
            var offMethods = _.map(subscribers, function(method, name) {
                return $rootScope.$on(name, method);
            });
            if(scope) {
                scope.$on('$destroy', function() {
                    _.each(offMethods, function(offMethod) {
                        offMethod();
                    });
                });
            }
        }

    };

})();
