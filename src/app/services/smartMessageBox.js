/* global $ */
(function() {
    'use strict';

    angular
        .module('mainApp')
        .value('smartMessageBox', $.SmartMessageBox.bind($))
        .value('bigBox', $.bigBox.bind($));

})();
