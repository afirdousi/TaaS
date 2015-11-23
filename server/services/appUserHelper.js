
var _ = require('lodash');

function AppUser(request) {
    if(!request || !request.user || !request.user.userId) {
        throw new Error("Authenticated user information not found for request.");
    }

    this._userInfo = {
        userId: request.user.userId,
        userName: request.user.userName,
        roles: request.user.roles || [],
        fullName: request.user.fullName,
        email:request.user.email || request.user.mail
    };
}

AppUser.prototype = {

    get userId() {
        return this._userInfo.userId;
    },

    get userName() {
        return this._userInfo.userName;
    },

    get fullName() {
        return this._userInfo.fullName;
    },
    get email() {
        return this._userInfo.email;
    },

    get isInBasicRole() {
        return this.isInRole("basic");
    },
    get isInAdvanceRole() {
        return this.isInRole("advance");
    },

    get isInAdminRole() {
        return this.isInRole("admin");
    },
    get isInScheduleRole() {
        return this.isInRole("schedule");
    },

    get userDetails() {
        return this._userInfo;
    },

    isInRole: function(name) {
        return _.some(this._userInfo.roles, function(role) {
            return role === name;
        });
    }
};

// Return the AppUser information from the current
// node request object.
// Assumes a previous middleware injected the
// user information in the form:
//
//  request.user = {
//      userId: 'my user id ...',
//      userName: 'my user name ...',
//  };
//
module.exports = function(request) {
    return new AppUser(request);
};
