module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        files: [

            /* Framework */
            'src/vendor/lodash/js/lodash.js',
            'src/vendor/moment/js/moment.js',
            'src/vendor/angular/js/angular.js',
            'src/vendor/angular-mocks/js/angular-mocks.js'

            /* Application code to test */
           /* 'src/app/services/expressions/expressionModule.js',*/

            /* Test specs */
            /*'test/unit/expressions/!*.spec.js',
            'test/unit/services/queryParams.spec.js',*/


            ///* Framework */
            //'src/vendor/lodash/js/lodash.js',
            //'src/vendor/moment/js/moment.js',
            //'src/vendor/angular/js/angular.js',
            //'src/vendor/angular-animate/js/angular-animate.js',
            //'src/vendor/angular-ui-router/js/angular-ui-router.js',
            //'src/vendor/angular-bootstrap/js/ui-bootstrap-tpls.js',
            //'src/vendor/angular-fullscreen/js/angular-fullscreen.js',
            //'src/vendor/angular-ui-grid/js/ui-grid.js',
            //'src/vendor/StickyHeader/fsm.js',
            //'src/vendor/angular-mocks/js/angular-mocks.js',
            //
            ///* Application code to test */
            //'src/app/services/queryExpression.js',
            //'src/app/services/queryBuilderService.js',
            //'src/app/services/localStorageService.js',
            //'src/app/services/configService.js',
            //'src/app/services/schemaService.js',
            //'src/app/services/sharedQueryService.js',
            //'src/app/services/searchEntryParser.js',
            //
            ///* Test specs */
            //'test/unit/**/*.spec.js'
        ],
        exclude: [
            'test/unit/controller/**/filtersQueryDetailsViewCtrl.spec.js',
            'test/unit/controller/**/queryModalInstanceCtrl.spec.js',
            'test/unit/controller/**/pagedMembersListViewCtrl.spec.js'
        ],
        reporters: ['spec', 'html'],
        specReporter: {
            suppressSkipped: true
        },
        singleRun: true,
        autoWatch: false,
        usePolling: true,
        browsers: ['Chrome']
    })
};