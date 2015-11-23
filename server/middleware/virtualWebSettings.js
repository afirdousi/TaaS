
var _ = require('lodash');
module.exports = function(app, webSettings) {

    
        var webSettingsTemplate = _.template(
        "angular.module('mainApp-settings', [])" +
        ".value('appConfig', {" +
        " solrUrl: '<%= data.solrUrl %>'," +
        " solrCollection: '<%= data.solrCollection %>'," +
        " appClientId: '<%= data.appClientId %>'," +
        " environment: '<%= data.environment %>'," +
        " contextRoot: '<%= data.contextRoot %>'," +
        " applicationVersion: '<%= data.applicationVersion %>'," +
        " solrAddress: '<%= data.solrAddress%>'," +
        " clientId: '<%= data.authentication.authorizedClients[0].id %>'," +
        " clientKey: '<%= data.authentication.authorizedClients[0].secret %>'" +
        "});", {
            variable: 'data'
        });
        app.use(webSettings.contextRoot + '/app/module/webSettings.js', function(req, res) {
        res.setHeader('Content-Type', 'application/javascript');
        res.send(webSettingsTemplate(webSettings));
    });

};
