/**
 * Created by Anas on 11/27/2015.
 */
var testerPayment = require('../../db/tester/payment');

var express = require('express');
var router = express.Router();


//Used for "User Profile" of Tester
router.get("/tester/fullpayment", function(req, res, next) {

    console.log("API/ PAYMENT /  FULL PAYMENT");

    testerPayment
        .getTesterFullPayment()
        .then(function (result) {

            /* console.log("getAppStatus()  result = ");
             console.log(result);*/

            res.json(result);
        })
        .catch(function (err) {
            next(err);
        });

});

//Used for "User Dashboard" of Tester
router.get("/basicpayment", function(req, res, next) {

    /*appMaintenanceCollection
     .getAppStatus()
     .then(function (result) {

     /!* console.log("getAppStatus()  result = ");
     console.log(result);*!/

     res.json(result);
     })
     .catch(function (err) {
     next(err);
     });*/

});



module.exports = router;

