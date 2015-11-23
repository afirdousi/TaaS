
var _ = require('lodash');
var path = require('path');

var optionExists = function(optionName) {
    return _.some(process.argv.slice(2), function(arg) { return arg === optionName; })
};

var deploymentTarget = process.env.DEPLOYMENT_TARGET || "dev";
if(optionExists("--deploy-prod")) {
    deploymentTarget = "prod";
}
/*else if(optionExists("--deploy-pilot")) {
    deploymentTarget = "pilot";
}
else if(optionExists("--deploy-dev")) {
    deploymentTarget = "dev";
}*/

//console.log("Using configuration for [%s] environment", deploymentTarget);
var webSettingsConfigPath = path.join(__dirname, '../config', deploymentTarget, 'webSettings.json');
//console.log("Configuration file: %s", webSettingsConfigPath);
var webSettings = require(webSettingsConfigPath);

webSettings = _.defaults((global.webSettings || {}), webSettings);
webSettings = _.defaults(webSettings, {
    startProxy: !optionExists("--no-proxy"),
    testMode: optionExists("--test-mode")
});
if(optionExists("--use-build")) {
    webSettings.useBuild = true;
}

module.exports = webSettings;
