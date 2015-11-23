
var Q = require('q');
var _ = require('lodash');
var nodeExcel = require('excel-export');
var csv = require('fast-csv');
var request = require('request');
var Readable = require('stream').Readable;
var webSettings = require('./webSettings');

var fieldList = [
    { name: "LoyaltyCardNumber", caption: "Member ID", width: 21 },
    { name: "ActiveMember", caption: "Active" },
    { name: "TotalSalesSHC", type: "number", width: 16, formatter: formatNumber },
    { name: "TotalSalesSears", type: "number", width: 16, formatter: formatNumber },
    { name: "TotalTripsSears", type: "number", width: 16, formatter: formatInteger },
    { name: "TotalSalesKmart", type: "number", width: 16, formatter: formatNumber },
    { name: "TotalTripsKmart", type: "number", width: 16, formatter: formatInteger },
    { name: "LastTransactionDate", type: "date", width: 19, formatter: formatDate },
    { name: "ShoppedStore12Month", caption: "DMA", type: "string", width: 19, formatter: formatDMAValue },
    { name: "ShoppedStore12Month", caption: "District",type: "string", width: 19, formatter: formatDistrictValue },
    { name: "ShoppedStore12Month", caption: "Store",type: "string", width: 19, formatter: formatStoreValue },
    { name: "ShoppedStore12Month", caption: "State",type: "string", width: 19, formatter: formatStateValue },
    { name: "ShoppedStore12Month", caption: "Zipcode",type: "string", width: 19, formatter: formatZipcodeValue },
    { name: "ShoppedSearsBU12Month", caption: "Sears BU",type: "string", width: 19, formatter: formatBUValue },
    { name: "ShoppedKmartBU12Month", caption: "Kmart BU",type: "string", width: 19, formatter: formatBUValue },
    { name: "MRCFormatTripperSears", type: "string", width: 19, formatter:formatMRCTripper},
    { name: "MRCFormatTripperKmart", type: "string", width: 19, formatter:formatMRCTripper}
];

function numberHandler(multiplier) {
    return function(row, cellData, eOpt){
        if (_.isUndefined(cellData) || _.isNull(cellData)){
            eOpt.cellType = 'string';
            return '';
        }
        else {
            return Math.floor(Number(cellData) * multiplier) / multiplier;
        }
    }
}
function formatInteger() {
    return numberHandler(1.0);
}
function formatNumber() {
    return numberHandler(100.0);
}

function formatDMAValue(){
    return function(row, cellData, eOpt){
        if (_.isUndefined(cellData) || _.isNull(cellData)){
            eOpt.cellType = 'string';
            return '';
        }
        else {
            var newArray = _.filter(cellData, function(cd){
                if(_.includes(cd,'06 || DMA:')) {
                    return cd;
                }
            }).map(function(cd){
                return cd.slice(cd.indexOf(':')+1, cd.length);
            }).toString();
            return newArray;
        }
    }
}

function formatDistrictValue(){
    return function(row, cellData, eOpt){
        if (_.isUndefined(cellData) || _.isNull(cellData)){
            eOpt.cellType = 'string';
            return '';
        }
        else {
            var newArray = _.filter(cellData, function(cd){
                if(_.includes(cd,'04 || District:')) {
                    return cd;
                }
            }).map(function(cd){
                return cd.slice(cd.indexOf(':')+1, cd.length);
            }).toString();
            return newArray;
        }
    }
}

function formatStoreValue(){
    return function(row, cellData, eOpt){
        if (_.isUndefined(cellData) || _.isNull(cellData)){
            eOpt.cellType = 'string';
            return '';
        }
        else {
            var newArray = _.filter(cellData, function(cd){
                if(_.includes(cd,'01 || Store:')) {
                    return cd;
                }
            }).map(function(cd){
                return cd.slice(cd.indexOf(':')+1, cd.length);
            }).toString();
            return newArray;
        }
    }
}

function formatStateValue(){
    return function(row, cellData, eOpt){
        if (_.isUndefined(cellData) || _.isNull(cellData)){
            eOpt.cellType = 'string';
            return '';
        }
        else {
            var newArray = _.filter(cellData, function(cd){
                if(_.includes(cd,'03 || State:')) {
                    return cd;
                }
            }).map(function(cd){
                return cd.slice(cd.indexOf(':')+1, cd.length);
            }).toString();
            return newArray;
        }
    }
}

function formatZipcodeValue(){
    return function(row, cellData, eOpt){
        if (_.isUndefined(cellData) || _.isNull(cellData)){
            eOpt.cellType = 'string';
            return '';
        }
        else {
            var newArray = _.filter(cellData, function(cd){
                if(_.includes(cd,'05 || ZipCode:')) {
                    return cd;
                }
            }).map(function(cd){
                return cd.slice(cd.indexOf(':')+1, cd.length);
            }).toString();
            return newArray;
        }
    }
}

function formatBUValue(){
    return function(row, cellData, eOpt){
        if (_.isUndefined(cellData) || _.isNull(cellData)){
            eOpt.cellType = 'string';
            return '';
        }
        else {
         return String(cellData);
        }
    }
    }
function formatMRCTripper(){
    return function(row, cellData, eOpt){
        if (_.isUndefined(cellData) || _.isNull(cellData)){
            eOpt.cellType = 'string';
            return '';
        }
        else {
            var newArray = _.map(cellData, function(d){
                return d.slice(d.indexOf(':')+1, d.indexOf('|'));
            }).toString();
            return newArray;
        }
    }
}
function formatDate() {
    var originDate = new Date(1899,11,30);
    return function(row, cellData, eOpt){
        if (_.isUndefined(cellData) || _.isNull(cellData)){
            eOpt.cellType = 'string';
            return '';
        }
        else {
            return (new Date(cellData) - originDate) / (24 * 60 * 60 * 1000);
        }
    }
}


function ExportMembersList() {
}

ExportMembersList.prototype = {

    parseExportRequest: function(req, maxRows) {

        if(!req.body || !req.body.exportQueryString || !req.body.exportRowCount) {
            return {
                error: {
                    status: 400,
                    message: "Invalid export parameters"
                }
            };
        }

        var rowCount = Number(req.body.exportRowCount);
        if(_.isNaN(rowCount) || rowCount < 1) {
            return {
                error: {
                    status: 400,
                    message: "Invalid export row count."
                }
            };
        }
        if(maxRows && rowCount > maxRows) {
            rowCount = maxRows;
        }

        var queryParams;
        try {
            queryParams = JSON.parse(req.body.exportQueryString);
            queryParams.start = 0;
            queryParams.rows = rowCount;
        }
        catch(err) {
            return {
                error: {
                    status: 400,
                    message: "Invalid export query string."
                }
            };
        }

        return {
            rowCount: rowCount,
            queryParams: queryParams
        };
    },

    exportExcel: function(exportParams) {
        var attrList = exportParams.queryParams.exportAttrList;
        var newfieldList = [];
        _.each(attrList, function(element){
            _.each(fieldList, function(d){
                if(element.key === true && (element.value === d.caption || element.value === d.name)){
                    newfieldList.push(d);
                }
            })
        });

        return this._getMembersRecords(exportParams)
            .then(function(result) {

                var excelConfig = {
                    stylesXmlFile: "",
                    cols: _.map(newfieldList, function(f) {
                        var colDef = {
                            caption: f.caption || f.name,
                            type: f.type || 'string',
                            width: f.width || 9.0
                        };
                        if(f.formatter) {
                            colDef.beforeCellWrite = f.formatter();
                        }
                        return colDef;
                    }),
                    rows: _.map(result, function(r) {
                        return _.map(newfieldList, function(f) {
                            return r[f.name];
                        });
                    })
                };

                return nodeExcel.execute(excelConfig);
            });
    },

    exportCSV: function(exportParams, writeStream) {

        var dataStream = this._getMembersRecordStream(exportParams);
        var csvStream = csv.createWriteStream({
            headers: _.map(newfieldList, function(f) {
                return f.name;
            }),
            rowDelimiter: '\r\n'
        });
        dataStream.pipe(csvStream).pipe(writeStream);
    },

    _getMembersRecords: function(exportParams) {

        var deferred = Q.defer();

        var url = [
            webSettings.solrAddress,
            "solr",
            webSettings.solrCollection,
            "select"
        ].join("/");

        var requestOptions = {
            url: url,
            method: "GET",
            qs: exportParams.queryParams,
            qsStringifyOptions: { arrayFormat: 'repeat' },
            json: true
        };

        request(requestOptions, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                deferred.resolve(body.response.docs);
            }
            else {
                deferred.reject(err);
            }
        });

        return deferred.promise;
    },

    _getMembersRecordStream: function(exportParams) {

        var pageSize = 1000;
        var maxRows = exportParams.rowCount;
        var totalRowCount = 0;
        var queryParams = exportParams.queryParams;
        var resultIdx = 0;
        var cursorMark = "*";
        var currentResult = [];
        var url = [
            webSettings.solrAddress,
            "solr",
            webSettings.solrCollection,
            "select"
        ].join("/");

        var readStream = new Readable({ objectMode: true });
        readStream._read = function() {

            var strm = this;
            if(totalRowCount < maxRows) {
                if(resultIdx < currentResult.length) {
                    pushNextResult();
                }
                else {
                    readNextPageOfRecords()
                        .then(function(result) {
                            resultIdx = 0;
                            currentResult = result;
                            pushNextResult();
                        })
                        .catch(function(err) {
                            strm.emit('error', err);
                        });
                }
            }
            else {
                strm.push(null);
            }

            function pushNextResult() {
                // This function is re-entrant, so special handling is required
                var result = currentResult[resultIdx];
                totalRowCount += 1;
                resultIdx += 1;
                strm.push(result);
            }
        };

        return readStream;

        function readNextPageOfRecords() {
            var requestOptions;
            var deferred = Q.defer();
            var start = Math.floor(totalRowCount / pageSize) * pageSize;
            delete queryParams.start;
            queryParams.cursorMark = cursorMark;
            queryParams.rows = Math.min(pageSize, maxRows - start);
            if(queryParams.rows > 0) {

                requestOptions = {
                    url: url,
                    method: "GET",
                    qs: queryParams,
                    qsStringifyOptions: { arrayFormat: 'repeat' },
                    json: true
                };

                request(requestOptions, function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        cursorMark = body.nextCursorMark;
                        deferred.resolve(body.response.docs);
                    }
                    else {
                        deferred.reject(err);
                    }
                });
            }
            else {
                deferred.resolve([]);
            }
            return deferred.promise;
        }
    }
};

module.exports = new ExportMembersList();
