(function() {
    'use strict';

    angular
        .module('mainApp')
        .service('manageUserUtilityService', [
            'USER_ROLES',
            ManageUserUtilityService
        ]);

    function ManageUserUtilityService(USER_ROLES) {
      this.USER_ROLES =USER_ROLES;        
    }

    ManageUserUtilityService.prototype = {

      getUserRoles: function(userObj){
          var roles = [];
          //Update user object
          if(userObj.selectedRoles.isAdmin){

              userObj.selectedRoles.isSchedule = userObj.selectedRoles.isAdvanced = userObj.selectedRoles.isBasic = true;

              roles.push(this.USER_ROLES.basic);
              roles.push(this.USER_ROLES.advance);
              roles.push(this.USER_ROLES.schedule);
              roles.push(this.USER_ROLES.admin);

          }else if(userObj.selectedRoles.isSchedule){

              userObj.selectedRoles.isBasic = true;             
              roles.push(this.USER_ROLES.basic);
              if(userObj.selectedRoles.isAdvanced){
                roles.push(this.USER_ROLES.advance);               
              }             
              roles.push(this.USER_ROLES.schedule);

          }else if(userObj.selectedRoles.isAdvanced){

              userObj.selectedRoles.isBasic = true;
              roles.push(this.USER_ROLES.basic);
              roles.push(this.USER_ROLES.advance);             

          }else if(userObj.selectedRoles.isBasic){
              roles.push(this.USER_ROLES.basic);
          }
          return roles;
      },

      setUserRolesForUI: function(existingUser){
          var self = this;
          existingUser.selectedRoles = {};
          _.forEach(existingUser.roles, function(role){
              switch(role){
                  case self.USER_ROLES.basic : existingUser.selectedRoles.isBasic = true;
                  break;
                  case self.USER_ROLES.advance : existingUser.selectedRoles.isAdvanced = true;
                  break;
                  case self.USER_ROLES.admin : existingUser.selectedRoles.isAdmin = true;
                  break;
                  case self.USER_ROLES.schedule : existingUser.selectedRoles.isSchedule = true;
                  break;
              }
          });
          return existingUser;
      },

      getSelectedUsers: function(userList){
          var self = this;
          var selectedUsers = [];
          _.forEach(userList, function(userObj){
              var selectedUser = {};
              if(userObj.selectedRoles && userObj.selectedRoles.isBasic && !userObj.userExist){
                  selectedUser.roles = self.getUserRoles(userObj);
                  selectedUser.userId = userObj.Id;
                  selectedUser.userName = userObj.Name;
                  selectedUsers.push(selectedUser);
              }
          });
          return selectedUsers;
      },

      updateUserListOnDelete: function(existingUsers, userId){
          _.remove(existingUsers, function(userObj){
              return userObj.userId === userId;
          });
          return existingUsers;
      },

      updateUserListOnSave: function(searchedUsers, currentlyUpdatedUsers){
        _.forEach(searchedUsers, function(userObj){
          _.forEach(currentlyUpdatedUsers, function(updtaedUserObj){
              if(updtaedUserObj.userId === userObj.Id)
                  userObj.userExist = true;
          });
        });

        return searchedUsers;
      },

      isUserExist:function(existingUserList, lDAPUserId){
        var existingUser = {};
        var self = this;
         _.forEach(existingUserList, function(userObj){
            if(userObj.userId && userObj.userId === lDAPUserId){
                userObj.userExist = true;
                existingUser = self.setUserRolesForUI(userObj);
                return false; //to break the loop
            }
        });
        return existingUser;
      }

    };

})();
