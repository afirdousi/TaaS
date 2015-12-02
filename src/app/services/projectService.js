/**
 * Created by Anas on 12/1/2015.
 */
(function() {

    'use strict';

    angular
        .module('mainApp')
        .service('projectService', [
            '$http',
            ProjectService
        ]);

    function ProjectService($http) {

        var self = this;

        this.$http = $http;

    }

    ProjectService.prototype = {

        getProjectSuggestions:function(){

            console.log("Project Service :getProjectSuggestions" );
            return this.$http({
                method: 'GET',
                url: 'api/tester/projectnames',  // 'taas' should not be hardcoded and should come from 'this.appConfig.contextRoot'
                cache: true
            }).then(function(result) {
                console.log(result);
                return result.data;
            });
        }
    };

}());
