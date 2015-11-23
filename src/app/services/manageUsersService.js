(function() {
    'use strict';

    angular
        .module('mainApp')
        .service('ManageUserService', [
            '$http',
            '$q',
            'AuthServiceState',
            'appConfig',
            ManageUserService
        ]);

    function ManageUserService($http, $q, AuthServiceState, appConfig) {

        this.$http = $http;
        this.$q = $q;
        this.authServiceState = AuthServiceState;
        this.appConfig = appConfig;
    }

    ManageUserService.prototype = {

        saveSelectedUsers: function(userList){
          var self = this;
          var deferred = self.$q.defer();
          var postData = {};
          postData.userList = userList;
          postData.createrId = this.authServiceState.currentUserId;
          self.$http({
              method: 'POST',
              url: self.appConfig.contextRoot + '/api/users',
              headers: { 'Content-Type': 'application/json' },
              data: postData
          }).then(function(result) {
              deferred.resolve(result);
          });

          return deferred.promise;
        },

        getSavedUsers: function(){
          var self = this;
          var deferred = self.$q.defer();
          self.$http({
            method: 'GET',
            url: self.appConfig.contextRoot + '/api/users',
            params : {timeStamp: new Date()}
          }).then(function(response){
              deferred.resolve(response.data);
          });
          return deferred.promise;
        },

        deleteUser: function(userId){
          var self = this;
          var deferred = self.$q.defer();
          self.$http({
            method: 'DELETE',
            url: self.appConfig.contextRoot + '/api/users/' +userId,
          }).then(function(response){
              deferred.resolve(response.data);
          });
          return deferred.promise;
        },

        updateUser: function(userObj){
          var self = this;
          var deferred = self.$q.defer();
          var postData = {};
          postData.userId = userObj.userId;
          postData.userName = userObj.userName;
          postData.roles = userObj.roles;
          postData.createrId = userObj.createrId;
          self.$http({
            method: 'PUT',
            url: self.appConfig.contextRoot + '/api/users/' +userObj.userId,
            data: postData
          }).then(function(response){
              deferred.resolve(response.data);
          });
          return deferred.promise;
        }

    };

})();