
var Q = require('q');

function ApiHelpers() {
}

ApiHelpers.prototype = {

    parseBoolean: function(value) {
        if(/^\s*(t|true|y|yes)\s*$/.test(value)) {
            return true;
        }
        if(/^\s*(f|false|n|no)\s*$/.test(value)) {
            return false;
        }
        // otherwise, undefined
    }

};

module.exports = new ApiHelpers();
