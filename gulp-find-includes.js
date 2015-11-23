'use strict';

var through = require('through2'),
    path = require('path'),
    gutil = require('gulp-util'),
    _ = require('lodash'),
    PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-find-includes';

function findIncludes(file, options) {

    var contents = file.contents.toString();
    var itemsFound = _.defaults(options.result, {
        css: [],
        js: []
    });

    findScriptReferences(contents, itemsFound);
    findStyleReferences(contents, itemsFound);
    //console.log(JSON.stringify(itemsFound, null, 4));
    return itemsFound;
}

function findScriptReferences(contents, itemsFound) {
    var scriptRegex = /<script\s+.*[^>]/g,
        nameRegex = /src=('(.*?)'|"(.*?)")/,
        scriptMatch, nameMatch;
    while((scriptMatch = scriptRegex.exec(contents)) !== null) {
        if((nameMatch = nameRegex.exec(scriptMatch[0])) !== null) {
            itemsFound.js.push((nameMatch[2] || "") + (nameMatch[3] || ""));
        }
    }
}

function findStyleReferences(contents, itemsFound) {
    var styleRegex = /<link\s+.*stylesheet.*[^>]/g,
        nameRegex = /href=('(.*?)'|"(.*?)")/,
        styleMatch, nameMatch;
    while((styleMatch = styleRegex.exec(contents)) !== null) {
        if((nameMatch = nameRegex.exec(styleMatch[0])) !== null) {
            itemsFound.css.push((nameMatch[2] || "") + (nameMatch[3] || ""));
        }
    }
}

function gulpFindIncludes(options) {

    options = _.defaults(options || {}, {
        result: {}
    });

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
                findIncludes(file, options);
            } catch (err) {
                this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
            }
        }

        this.push(file);
        return callback();
    });

    return stream;
}

module.exports = gulpFindIncludes;
