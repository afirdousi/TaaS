/**
 * Created by Anas on 11/27/2015.
 */

var _ = require('lodash');
var Q = require('q');
var mongodbClient = require('./../mongodbClient');
var ObjectId = require('mongodb').ObjectId;
var dbHelpers = require('./../dbHelpers');

function TesterPayment() {
}

TesterPayment.prototype = {

    // Method for External API

    getTesterFullPayment: function() {
        return dbHelpers
            .getTesterPaymentCollection()
            .then(function(collection) {
                var criteria = {_id:ObjectId("565b873a2dc9c7345605fcde")};
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

module.exports = new TesterPayment();
