(function(){

"use strict";

 angular
        .module('mainApp')
        .controller('addUserCtrl', [
            'AuthService',
            'ManageUserService',
            'manageUserUtilityService',
            '$timeout',
            'USER_ROLES',
            AddUserCtrl
        ]);

    function AddUserCtrl(AuthService, ManageUserService, manageUserUtilityService, timeout, USER_ROLES) {

        this.AuthService = AuthService;
        this.manageUserService = ManageUserService;
        this.manageUserUtilityService = manageUserUtilityService;
        this.timeout = timeout;
        this.USER_ROLES  = USER_ROLES;
        this.searchedLDAPUser = {
            LDAPName : ''
        };
        this.matchedLDAPUsers = [];
        this.message = "";
        this.showMessage = false;
        this.removeUser = {};
      
    }

    AddUserCtrl.prototype = {        

        get isSaveAccess(){
            var flag = false;
             _.forEach(this.matchedLDAPUsers, function(userObj){
                if(userObj.selectedRoles && userObj.selectedRoles.isBasic && userObj.selectedRoles.isBasic === true){                    
                    flag = true;
                }
            });
            return flag;
        },
        
        _checkForExistingUsers: function(searchUserList){
            var self = this;
            this.manageUserService.getSavedUsers().then(function(response){
                _.forEach(searchUserList, function(userObj){
                    var isUesrExists = self.manageUserUtilityService.isUserExist(response, userObj.Id);
                    if(isUesrExists.userExist){
                        userObj.selectedRoles = isUesrExists.selectedRoles;
                        userObj.userExist = isUesrExists.userExist;
                    }else{
                        userObj.userExist = false;
                    }
                });
                self.matchedLDAPUsers = searchUserList; 
            });
        },

        searchLDAPUsers: function() {
            var self = this;
            self.isLoadingData = true;
            self.AuthService.searchLDAPUsers(self.searchedLDAPUser)
            .then(function(result){
                self.matchedLDAPUsers = result;
                self._checkForExistingUsers(self.matchedLDAPUsers);
                self.isLoadingData = false;
            });
        },

        updateRole: function(user){
            var self = this;
            user.roles = self.manageUserUtilityService.getUserRoles(user);
        },

        saveSelectedUsers: function(){
            var self = this;
            var selectedUsers = self.manageUserUtilityService.getSelectedUsers(this.matchedLDAPUsers);
            
            if(selectedUsers && selectedUsers.length > 0){
                self.manageUserService.saveSelectedUsers(selectedUsers)
                .then(function(result){
                    self.matchedLDAPUsers = self.manageUserUtilityService.updateUserListOnSave(self.matchedLDAPUsers, selectedUsers);
                    if(result.statusText === "Created"){
                        self.message = "Selected users saved successfully.";
                        self.showMessage = true;
                        self.timeout(function(){
                            self.showMessage = false;
                          }, 5000);
                    }
                });
            }
        }
    };

}());


