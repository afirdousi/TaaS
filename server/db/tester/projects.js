/**
 * Created by Anas on 11/27/2015.
 */

var _ = require('lodash');
var Q = require('q');
var mongodbClient = require('./../mongodbClient');
var ObjectId = require('mongodb').ObjectId;
var dbHelpers = require('./../dbHelpers');

function TesterProjects() {
}

TesterProjects.prototype = {

    // Method for External API
    getProjectSuggestions: function() {

        console.log("getProjectSuggestions()");

        return dbHelpers
            .getProjectCollection()
            .then(function(collection) {
                return collection.find({},{_id:0,title:1})
                    .then(dbHelpers.resultAsArray)
                    .then(function(data) {
                        console.log(data);
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

module.exports = new TesterProjects();
