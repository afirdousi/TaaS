(function() {
    'use strict';

    angular
        .module('mainApp')
        .controller('searchEntryViewCtrl', [
            '$q',
            '$rootScope',
            '$scope',
            '$timeout',
            'attributeList',
            'currentQuery',
            SearchEntryViewCtrl
        ]);

    function SearchEntryViewCtrl(
        $q,
        $rootScope,
        $scope,
        $timeout,
        attributeList
        ) {

        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.attributeList = attributeList;
        this.textEntry = "";
        this.topSearchAttrValues = {};
        this.isTextBoxEmpty = (this.textEntry==='');
        this.dateEquals=false;
        this.parseStates = {
            error: -1,
            empty: 0,
            attr: 1,
            operator: 2,
            value: 3,
            filter:4
        };
        this.parseInfo = {
            textEntry: ""
        };
        this.currentState = this.parseStates.attr;
        this._isInitialized = false;
        this._initialize();

        this.placeHolderMessages = ['Search for Project or People', 'Select operator', 'Type attribute Value','Click on Add Filter button'];
        this.msg = this.placeHolderMessages[0];
        var self = this;

        this.$scope.$on('cleanMainSearchInput', function(event){
            if(self.valuesExist == false){
                 self.cleanMainSearchInput();

                 self.$timeout(function(){

                   $('.user-input').focus();
                 }, 100);
             }
        });
            
    }
           

    SearchEntryViewCtrl.prototype = {

        _initialize: function() {
            var self = this;
            self.attributeList
                .afterAttributesLoaded()
                .then(function(){
                    self._isInitialized = true;
                });
        },
       
        validateInput: function(){
            if(this.AttributeValues.IsRange){
                if(!(_.isFinite(parseInt(this.value)) || (_.isFinite(parseInt(this.valueOne)) && _.isFinite(parseInt(this.valueTwo))))){
                    this.isNotANumber = false;
                }

                if(!this.isNotANumber){
                    this.cleanMainSearchInput();
                    this.isNotANumber = false;
                }else{
                    this.addCondition();
                }

            } else{
                this.addCondition();
            }

        },

        focusText:function(){
            $('.user-input').focus();
        }
    };

})();
