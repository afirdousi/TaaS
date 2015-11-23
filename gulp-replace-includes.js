'use strict';

var through = require('through2'),
    gutil = require('gulp-util'),
    _ = require('lodash'),
    PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-replace-includes';

var scriptTemplate = _.template(
    '<script src="<%= data.name %>"></script>',
    { variable: 'data' });
var styleTemplate = _.template(
    '<link rel="stylesheet" type="text/css" media="screen" href="<%= data.name %>">',
    { variable: 'data' });

function replaceIncludes(file, itemsFound) {
    var contents = file.contents.toString();
    contents = replaceStyleReferences(contents, itemsFound);
    contents = replaceScriptReferences(contents, itemsFound);
    return contents;
}

function replaceScriptReferences(contents, itemsFound) {
    var firstMatch = true, scriptRegex = /<script\s+.*src=.*[^>]/g;
    return contents.replace(scriptRegex, function(m) {
        if(firstMatch) {
            firstMatch = false;
            return _(itemsFound.jsVendorGen)
                .concat(['app/module/webSettings.js'])
                .concat(itemsFound.jsAppGen)
                .map(function(name) {
                    return scriptTemplate({
                        name: name
                    });
                })
                .value()
                .join("\n");
        }
        return "";
    });
}

function replaceStyleReferences(contents, itemsFound) {
    var firstMatch = true, styleRegex = /<link\s+.*stylesheet.*[^>]/g;
    return contents.replace(styleRegex, function(m) {
        if(firstMatch) {
            firstMatch = false;
            return _(itemsFound.cssVendorGen)
                .concat(itemsFound.cssAppGen)
                .map(function(name) {
                    return styleTemplate({
                        name: name
                    });
                })
                .value()
                .join("\n");
        }
        return "";
    });
}


function gulpReplaceIncludes(itemsFound) {

    var stream = through.obj(function(file, enc, callback) {

        if (file.isNull()) {
            this.push(file); // Do nothing if no contents
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported!'));
            return callback();
        }

        if (file.isBuffer()) {
            try {
                file.contents = new Buffer( replaceIncludes( file, itemsFound ) );
            } catch (err) {
                this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
            }
        }

        this.push(file);
        return callback();
    });

    return stream;
}

module.exports = gulpReplaceIncludes;
