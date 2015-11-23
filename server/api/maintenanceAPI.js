var apiHelpers = require('../services/apiHelpers');
var appMaintenanceCollection = require('../db/appMaintenance');

var express = require('express');
var router = express.Router();


    router.get("/maintenance", function(req, res, next) {

        appMaintenanceCollection
            .getAppStatus()
            .then(function (result) {

               /* console.log("getAppStatus()  result = ");
                console.log(result);*/

               res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    
    });

    router.post("/maintenance", function(req, res, next) {

        appMaintenanceCollection
            .setAppStatus(req.body)
            .then(function (result) {

                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });

    });

module.exports = router;
