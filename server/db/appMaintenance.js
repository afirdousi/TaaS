
var _ = require('lodash');
var Q = require('q');
var mongodbClient = require('./mongodbClient');
var ObjectId = require('mongodb').ObjectId;
var dbHelpers = require('./dbHelpers');

function AppMaintenance() {
}

AppMaintenance.prototype = {

    // Method for External API

    getAppStatus: function() {
        return dbHelpers
            .getAppMaintenanceCollection()
            .then(function(collection) {
                //var criteria = {_environment:environment};
                return collection.findOne()
                    //.then(dbHelpers.resultAsArray)
                    .then(function(data) {
                        return data;//_.map(data, convertToModelObject);
                    });
            });
    },
    setAppStatus: function(data) {

        /*console.log("Setting app status");
        console.log("status = " + data.status);
        console.log("msg = " + data.msg);*/

        return dbHelpers
            .getAppMaintenanceCollection()
            .then(function(collection) {
                    return collection
                        .update({}, {$set: {status: data.status, msg: data.msg}})
                        .then(function (data) {
                            return data;
                        });
                });
    },

    close: mongodbClient.close.bind(mongodbClient)
};

/*function convertToModelObject(item) {
    item.searchId = item._id.toString();
    delete item._id;
    return item;
}*/

module.exports = new AppMaintenance();
