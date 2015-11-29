/**
 * Created by Anas on 11/27/2015.
 */

var _ = require('lodash');
var Q = require('q');
var mongodbClient = require('./../mongodbClient');
var ObjectId = require('mongodb').ObjectId;
var dbHelpers = require('./../dbHelpers');

function TesterProfile() {
}

TesterProfile.prototype = {

    // Method for External API

    getTesterFullProfile: function() {
        return dbHelpers
            .getTesterProfileCollection()
            .then(function(collection) {
                var criteria = {_id:ObjectId("565a81ceec58c82b9c55800f")};
                return collection.findOne(criteria)
                    //.then(dbHelpers.resultAsArray)
                    .then(function(data) {
                        return data;//_.map(data, convertToModelObject);
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

module.exports = new TesterProfile();
