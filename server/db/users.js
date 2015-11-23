
var _ = require('lodash');
var Q = require('q');
var mongodbClient = require('./mongodbClient');
var dbHelpers = require('./dbHelpers');

function Users() {
}

Users.prototype = {

    getUsers: function() {
        return dbHelpers
            .getUserProfileCollection()
            .then(function(collection) {
                var criteria = {};
                return Q.when(collection.find(criteria))
                    .then(dbHelpers.resultAsArray)
                    .then(function(data) {
                        return _.map(data, convertToModelObject);
                    });
            });
    },

    getUser: function(userId) {
        return dbHelpers
            .getUserProfileCollection()
            .then(function(collection) {
                var criteria = { _id: userId };
                return collection.findOne(criteria)
                    .then(function(data) {
                        return data ? convertToModelObject(data) : null;
                    });
            });
    },

    addUser: function(userInfo) {
        return dbHelpers
            .getUserProfileCollection()
            .then(function(collection) {
                return collection.insert(convertFromModelObject(userInfo))
                    .then(function(data) {
                        if(userInfo.userList){
                            return data.result;
                        }else{
                            return { userId: userInfo._id.toString() };
                        }
                    });
            });
    },

    updateUser: function(userInfo) {
        return dbHelpers
            .getUserProfileCollection()
            .then(function(collection) {
                var criteria = { "_id": userInfo.userId };
                return collection.update(criteria, convertFromModelObject(userInfo))
                    .then(function(data) {
                        return { userId: userInfo._id.toString() };
                    });
            });
    },

    deleteUser: function(userId) {
        return dbHelpers
            .getUserProfileCollection()
            .then(function(collection) {
                var criteria = { "_id": userId };
                return collection.remove(criteria)
                    .then(function() {
                        return { userId: userId };
                    });
            });
    },

    close: mongodbClient.close.bind(mongodbClient)
};

function convertToModelObject(item) {
    item.userId = item._id.toString();
    item.fullName =  item.userName.split('(')[0]; // TODO: This is hacky, discuss this with Pramod becaue some one might not have ( ) saved in LDAP
    delete item._id;
    return item;
}
function convertFromModelObject(item) {
    if(item && item.userList && _.isArray(item.userList)){
        var users = [];
        _.forEach(item.userList, function(obj){
            obj._id = obj.userId;
            delete obj.userId;
            obj.createrId = item.createrId;
            users.push(obj);
        });
        item = users;
    }else{
        item._id = item.userId;
        delete item.userId;
    }
    return item;
}

module.exports = new Users();
