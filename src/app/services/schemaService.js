(function() {
    'use strict';

    var dumpAttributeInfo = false;

    angular
        .module('mainApp')
        .service('schemaService', [
            '$http',
            '$log',
            'appConfig',
            SchemaService
        ]);

    function SchemaService($http, $log, appConfig) {
        this.$http = $http;
        this.$log = $log;
        this.appConfig = appConfig;
    }

    SchemaService.prototype = {

        getAttributes: function() {
            var self = this;
            return self.$http({
                method: 'GET',
                url: self.appConfig.contextRoot + '/app/data/attributes.json',
                cache: true
            }).then(function(result) {
                if(dumpAttributeInfo) {
                    dumpAttributeInfo = false;
                    self._dumpAttributeInfo(result.data);
                }

                return result.data;
            });
        },


        _dumpAttributeInfo: function(attrList) {
            this.$log.info("--- Attributes Info -------------------------------");
            this.$log.info(JSON.stringify(_(attrList)
                .groupBy(function(attr) {
                    return attr.UIType;
                })
                .map(function(v, k) {
                    return {
                        controlType: k,
                        count: v.length,
                        attributes: _(v)
                            .map(function(attr) {
                                return attr.AttributeCollectionMapping;
                            })
                            .sortBy(function(n) { return n; })
                            .value()
                    };
                })
                .value(), null, 4));
            this.$log.info("---------------------------------------------------");
        }
    };

})();
