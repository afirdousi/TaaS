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

        getGroups: function() {
            return this.$http({
                method: 'GET',
                url: this.appConfig.contextRoot + '/app/data/groups.json',
                cache: true
            }).then(function(result) {
                return result.data;
            });
        },

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

        getMSM: function() {
            return this.$http({
                method: 'GET',
                url: this.appConfig.contextRoot + '/app/data/msm.json',
                cache: true
            }).then(function(result) {
                return result.data;
            });
        },

        getInteractions: function() {
            return this.$http({
                method: 'GET',
                url: this.appConfig.contextRoot + '/app/data/interactions.json',
                cache: true
            }).then(function(result) {
                return result.data;
            });
        },

        getSalesBU: function() {
            return this.$http({
                method: 'GET',
                url: './app/data/salebyBU.json',
                cache: true
            }).then(function(result) {
                return result.data;

            });
        },

        getBreakdowns: function() {
            return this.$http({
                method: 'GET',
                url: this.appConfig.contextRoot + '/app/data/breakdowns.json',
                cache: true
            }).then(function(result) {
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
        }, 
        
        getreportViewList: function() {
            return this.$http({
                method: 'GET',
                url: this.appConfig.contextRoot + '/app/data/reportViewList.json',
                cache: true
            }).then(function(result) {
                return result.data;
            });
        }
    };

})();
