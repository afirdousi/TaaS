(function() {
    'use strict';

    // Represents the current query (the filer expression) that is
    // the current one represented by the application.

    angular
        .module('mainApp')
        .service('currentQuery', [
            '$rootScope',
            '$log',
            CurrentQuery
        ]);

    function CurrentQuery(
        $rootScope,
        $log) {

        this.$rootScope = $rootScope;
        this.$log = $log;


        this.__currentQueryBuilder = null;
    }

    CurrentQuery.prototype = {

        get queryBuilder() {
            var filterQueryText;
            var queryBuilder = this.__currentQueryBuilder;
            if(!queryBuilder) {
               /* this.__currentQueryBuilder = queryBuilder = this.queryBuilderService.create();
                filterQueryText = this.currentExpression.queryText;
                if(filterQueryText) {
                    queryBuilder.addFilterQuery(filterQueryText);
                }*/
            }
            return queryBuilder.clone();
        },

        refreshCurrentQuery: function() {
            this.__currentQueryBuilder = null;
        },

        get currentExpression() {
            return this.__currentExpression;
        },

        clearCurrentQuery: function() {
            this.__currentExpression = new this.Expression();
            this.refreshCurrentQuery();
        },

        saveCurrentQuery: function() {
            return this.currentExpression.serialize();
        },

        restoreCurrentQuery: function(expressionData) {
            try {
                this.__currentExpression = this.Expression.Deserialize(expressionData);
            }
            catch(err) {
                this.$log.error("Error loading current query.");
                this.$log.error(err);
                this.clearCurrentQuery();
            }
            this.refreshCurrentQuery();
        },

        get hasExpression() {
            return !this.currentExpression.isEmpty;
        },

        get filterCount() {
            return this.currentExpression.filterCount;
        }

    };

}());
