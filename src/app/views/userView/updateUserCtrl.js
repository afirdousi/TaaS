(function(){

"use strict";

 angular
        .module('mainApp')
        .controller('updateUserCtrl', [
            'ManageUserService',
            'manageUserUtilityService',
            '$timeout',
            'USER_ROLES',
            'xlsxService',
            'filterFilter',
            UpdateUserCtrl
        ]);

    function UpdateUserCtrl(ManageUserService, manageUserUtilityService, timeout, USER_ROLES, xlsxService, filterFilter) {

        this.manageUserService = ManageUserService;
        this.manageUserUtilityService = manageUserUtilityService;
        this.xlsxService = xlsxService;
        this.filterFilter = filterFilter;
        this.timeout = timeout;
        this.USER_ROLES  = USER_ROLES;
        this.matchedLDAPUsers = [];
        this.existingUsers = [];
        this.message = "";
        this.searchString = '';
        this.showMessage = false;
        this.getSavedUsers();

        this.workBook = {};
        this.workBook.SheetNames = [];
        this.workBook.Sheets = {};

      
    }

    UpdateUserCtrl.prototype = {        
        getSavedUsers: function(){
            var self = this;
            self.isLoadingData = true;
            self.manageUserService.getSavedUsers().then(function(response){

                console.log(response);

                _.forEach(response, function(userObj){
                    userObj = self.manageUserUtilityService.setUserRolesForUI(userObj);
                });
                self.isLoadingData = false;
                self.existingUsers = response;
            });
        },

        deleteUser: function(userId){
            var self = this;
            self.manageUserService.deleteUser(userId).then(function(response){
                self.existingUsers = self.manageUserUtilityService.updateUserListOnDelete(self.existingUsers, userId);
            });
        },

        updateUser: function(userObj){
            var self = this;
            userObj.roles = self.manageUserUtilityService.getUserRoles(userObj);
            self.manageUserService.updateUser(userObj).then(function(response){
                if(response && response.userId){
                    self.message = "User: " + response.userId + " updated successfully.";
                    self.showMessage = true;
                    self.timeout(function(){
                        self.showMessage = false;
                      }, 3000);
                }
            });
        },

        exportExcel: function(){

            var ws_name = "user_sheet";
            var usersData = this.filterFilter(this.existingUsers, this.searchString);
            var workSheet = this.xlsxService.workSheetFromUserData(usersData);

            this.workBook.SheetNames.push(ws_name);
            this.workBook.Sheets[ws_name] = workSheet;

            var workBookOut = XLSX.write(this.workBook, { bookType: 'xlsx', bookSST: true, type: 'binary'} );

            saveAs(new Blob( [this.xlsxService.convertToBinary( workBookOut ) ], { type: "application/octet-stream" } ), "MDE_Users.xlsx")

        }
       
            
    };

}());
