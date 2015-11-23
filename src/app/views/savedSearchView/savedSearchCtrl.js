(function(){

"use strict";

 angular
        .module('mainApp')
        .controller('savedSearchCtrl', [
            'SavedSearchService',
            'AuthServiceState',
            'queryEditerService',
            'imvService',           // for member peek view
            'scheduleService',      // for schedules of saved search
            'commonQuery',
            'queryExpression',
            '$timeout',
            '$scope',
            '$rootScope',
            'panelStates',
            '$state',
            'prompt',
            'scheduleViewModel',  // we might want to remove this dependency, injecting this to read scheduleList[]
            SavedSearchCtrl
        ])
        .filter('hideMemberId', function() {
            return function(input) {
                if(input) {
                    return input.replace(/^.{12}/, 'xxxxxxxxxxxx');
                }
            };
        });

    function SavedSearchCtrl(SavedSearchService, AuthServiceState, queryEditerService, imvService, scheduleService, commonQuery, queryExpression,
                                $timeout,$scope,$rootScope,panelStates,$state,prompt,scheduleViewModel) {
        ////console.log('Saved Search Control Loaded.');

        var self = this;

        this.prompt = prompt;

        this.AuthServiceState = AuthServiceState;
        this.queryEditerService = queryEditerService;
        this.commonQuery = commonQuery;
        this.imvService = imvService;
        this.pagerCtx = this.commonQuery.createPagedMembersContext();
        this.queryExpression = queryExpression;
        this.savedUserSearches = [];
        this.SavedSearchService = SavedSearchService;
        this.scheduleService = scheduleService;
        this.$timeout = $timeout;
        this.getAllSavedSearches();
        this.msg = '';
        this.$rootScope = $rootScope;
        this.panelStates = panelStates;
        this.$state = $state;
        this.scheduleViewModel = scheduleViewModel;
        this.showScheduleAlert = false;

        if(!this.inEditMode && !$scope.vmMain.isSavedSearchEditModeGlobal) {

            //If not in SAVED SEARCH EDIT MODE

            //Hide and remove attribute picker panel
            this.panelStates.isAttributesPanelOpen = false;
            this.panelStates.isAttributesPanelOpen = false;
            this.panelStates.isAttributesPanelRemoved = true;

            //Hide and remove filter query details panel
            this.panelStates.isFilterPanelExpanded = false;
            this.panelStates.isFiltersPanelOpen=false;
            this.panelStates.isFilterPanelRemoved = true;
        }

        $scope.$on("$destroy", function(){
           /* //console.log('Saved Search Controller Destroyed :  Show Left and Right Panel');
            self.$rootScope.$broadcast('SAVE_SEARCH_CLOSE');*/

            self.panelStates.isAttributesPanelRemoved = false;
            self.panelStates.isFilterPanelRemoved = false;
        });

        this.inEditMode = $scope.vmMain.isSavedSearchEditModeGlobal || false;

        $rootScope.$on("SAVE_SEARCH_UPDATED",function(){

           self.savedUserSearches = [];
           self.getAllSavedSearches();

        });
        $rootScope.$on("SAVE_SEARCH_EDIT_OFF",function(){

            //console.log("Saved Search /  Caught : SAVE_SEARCH_EDIT_OFF ");

            //Overall
            self.inEditMode = false;

            //Individual Records
            self.deselectApplied();

        });

        this.isLoading = true;

        this.showOnlyMySearch = true;


       /* this.SavedSearchService.getBusinessOwners().then(function(data){
            //console.log(data);
            self.businessOwnerLst = _.map(data,function(item){
                return item.name;
            });
        });*/

    }

    SavedSearchCtrl.prototype = {

        deselectApplied : function(){
            var self = this;
            _.forEach(self.savedUserSearches,function(o){
                if(o.applied){
                    o.applied =false;
                }
            });
        },

        hasPermissionToDelete : function(ownerId){

            //Either the user is owner of search or he is in Admin role
            var allowed =  this.isOwnerOfSearch(ownerId) || this.AuthServiceState.isInAdminRole;
            return allowed;

        },

        isOwnerOfSearch : function(ownerId){
            return this.AuthServiceState.currentUserId === ownerId;
        },

        getAllSavedSearches : function () {


            var self = this;
            self.isLoading = true;
            this.SavedSearchService.getSavedSearchCollection()
                .then(function(searchResult){

                    if(self.showOnlyMySearch) {
                        self.savedUserSearches = searchResult
                                                    .filter(function(item){
                                                            return self.isOwnerOfSearch(item.ownerId);
                                                        });
                    } else{
                        self.savedUserSearches = searchResult;
                    }

                    self.isLoading = false;

                    //In EDIT MODE
                    if(self.inEditMode){// && self.$scope.vmMain.isSavedSearchEditModeGlobal) {

                        //Fetch current query from local storage and highlight it
                        var currentQuery = localStorage.getItem("CURRENT_APPLIED_QUERY");
                        var sequenceID = JSON.parse(currentQuery).sequenceID;

                        var appliedQueryObj = _.find(self.savedUserSearches,function(queryObj){
                            return sequenceID == queryObj.sequenceID;
                        });

                        appliedQueryObj.applied = true;

                    }

                    for(var i= 0, len = self.savedUserSearches.length; i<len; i++) {
                        self.savedUserSearches[i].peek = false;
                        self.savedUserSearches[i].peeksearching = false;

                        self.savedUserSearches[i].isDailyOriginal = self.savedUserSearches[i].isDaily = _.some(
                            self.savedUserSearches[i].schedules,
                            function(i){
                                return i.title === "Daily";
                            });

                        self.savedUserSearches[i].isWeeklyOriginal = self.savedUserSearches[i].isWeekly = _.some(
                            self.savedUserSearches[i].schedules,
                            function(i){
                                return i.title === "Weekly";
                            });

                        self.savedUserSearches[i].isMonthlyOriginal = self.savedUserSearches[i].isMonthly = _.some(
                            self.savedUserSearches[i].schedules,
                            function(i){
                                return i.title === "Monthly";
                            });

                        self.savedUserSearches[i].isOnDemandOriginal = self.savedUserSearches[i].isOnDemand = _.some(
                            self.savedUserSearches[i].schedules,
                            function(i){
                                return i.title === "On Demand";
                            });

                        //hasChange will check for isDailyOriginal,isWeeklyOriginal,isMonthlyOriginal
                        self.savedUserSearches[i].hasChanged = false;
                    }



                    /*self.savedUserSearches = _.map(self.savedUserSearches,function(v){
                        return _.extend({},v,{daily: v.})

                    });*/




                }, function (error) {

                });

        },

        applySavedSearch: function (searchId) {
            this.deselectApplied();

            var self = this;

            var appliedQueryObj = _.find(this.savedUserSearches,function(queryObj){
                return searchId == queryObj.searchId;
            });

            //Used to highlight row inUI
            appliedQueryObj.applied = true;

            // Clear all filters
            this.commonQuery.filterQuery.removeAll();

            // Creating object to apply
            this.commonQuery.currentQuery.restoreCurrentQuery(appliedQueryObj.query);

            // Announce EDIT MODE : Moved this before refreshAll()  to avoid duplication check in EDIT MODE
            this.inEditMode = true;
            self.$rootScope.$broadcast('SAVE_SEARCH_EDIT_ON', appliedQueryObj.title,appliedQueryObj.notes, appliedQueryObj.businessOwner,appliedQueryObj.searchId);

            // Refresh All
            this.commonQuery.refreshAll();

            //Open Left and Right Side Panels
            self.panelStates.isAttributesPanelRemoved = false;
            self.panelStates.isFilterPanelRemoved = false;
            //Sallap :
            self.panelStates.isFiltersPanelOpen = true;
            self.panelStates.isFiltersPanelExpanded = true;


            //Store CURRENT Applied Query in Local Storage
            localStorage.setItem("CURRENT_APPLIED_QUERY",JSON.stringify(appliedQueryObj));


        },

        createFiltersList: function(appliedQueryObj){

            //TODO: This method is obsolete. Delete it after checking the app.

            //TODO: Create filters for 'AttributeBetweenDates' and 'AttributeRange' expression types

            var self = this;

            _.forEach(appliedQueryObj.query, function(queryArrayObj){

                _.forEach(queryArrayObj, function(attributeListObj){

                    if(!attributeListObj.isCondition){

                            switch(attributeListObj.attributeType){

                                case 'AttributeEquals': self.commonQuery.filterQuery.add(new self.queryExpression.AttributeEquals( attributeListObj, attributeListObj.attrValue, attributeListObj.attrDisplayValue));
                                break;
                                case 'AttributeWithPrefixEquals': self.commonQuery.filterQuery.add(new self.queryExpression.AttributeWithPrefixEquals( attributeListObj, attributeListObj.attrValue, attributeListObj.attrDisplayValue));
                                    break;
                              /*  case 'AttributeBetweenDates': self.commonQuery.filterQuery.add(new self.queryExpression.AttributeWithPrefixEquals( attributeListObj, attributeListObj.attrValue));
                                    break;*/
                                case 'AttributeEqualwithSYWR': self.commonQuery.filterQuery.add(new self.queryExpression.AttributeEqualwithSYWR( attributeListObj, attributeListObj.attrValue, attributeListObj.attrDisplayValue));
                                    break;
                                default:
                                    throw 'Saved Saerch Controller/createFiltersList() : Unrecognized type of attribute';
                                    break;
                            }

                            //We dont need the below code:
                            /**Setting group name for getting the icon class*/
                            //attributeListObj.attrGroupName = (attributeListObj.attr)?attributeListObj.attr.attrGroupName:'';
                    }

                });
            });

        },

        viewEditSavedSearch: function () {

        },

        saveSearch: function () {
            /*This method is written in Page Sub Header Controller */
        },

        deleteSearch:function(objectID){

            var self = this;
            this.msg = 'Deleting Saved Search ...';

            self.$timeout(function(){

                self.SavedSearchService.deleteSavedSearch(objectID)
                    .then(function(result){

                        _.remove(self.savedUserSearches,function(objectToDelete){
                            return objectToDelete.searchId==objectID;
                        });

                    }, function(error){
                        ////console.log(error);
                    });

            },1000);

        },

        // borrowed from pagedMembersListViewCtrl.js, since we only interested in first 1000(?),
        // no need for other pages.
        populateMembersListPage: function(savedSearchItem) {
            var self = this;
            var membersList = [];
            var DisplayWidth = 8; // constant
            var index = 0;
            var value = {};

            savedSearchItem.isLoading = true;
            savedSearchItem.membersList = [];
            self.pagerCtx.currentPage = 0;

            self.commonQuery
                .getPagedMembersDocuments(self.pagerCtx)
                .then(function(data) {
                    membersList = _.map(data, function(d) {
                        d.imvLink = self.imvService.getUrlForMemberId(d.LoyaltyCardNumber);
                        return d;
                    });

                    // convert membersList into two dimension array, for display purpose.
                    var times = membersList.length / DisplayWidth; // display width.
                    if (times>6) {
                        times=6;    // control how many lines of recordNumber peek will show. 6 at most.
                    }
                    for (var i=0; i<times; i++) {
                        var elem = {};
                        for (var j=0; j<DisplayWidth; j++) {
                            index = i * DisplayWidth + j;
                            if (index < membersList.length) {
                                value = {
                                    LoyaltyCardNumber: membersList[index].LoyaltyCardNumber,
                                    imvLink: membersList[index].imvLink,
                                    ActiveMember: membersList[index].ActiveMember
                                };
                            } else {
                                value = {
                                    LoyaltyCardNumber: '',
                                    imvLink: '',
                                    ActiveMember: false
                                };
                            }

                            switch(j) {
                                case 0:
                                    elem.zero = value;
                                    break;
                                case 1:
                                    elem.one = value;
                                    break;
                                case 2:
                                    elem.two = value;
                                    break;
                                case 3:
                                    elem.three = value;
                                    break;
                                case 4:
                                    elem.four = value;
                                    break;
                                case 5:
                                    elem.five = value;
                                    break;
                                case 6:
                                    elem.six = value;
                                    break;
                                case 7:
                                    elem.seven = value;
                                    break;
                                default:
                                    console.log('Shouldnt be here. ');
                                    break;
                            }

                        }
                        savedSearchItem.membersList.push(elem); // finished one row.

                        savedSearchItem.peeksearching = false;
                    }

                    savedSearchItem.isLoading = false;
                });
        },

        // get first 1000 member list of a saved search, for peek
        // Here we append member list to saved search directly.
        peekSearch: function(savedSearchItem) {
            var self = this;

            if (savedSearchItem.peek != false) {
                self.commonQuery.filterQuery.removeAll();

                // Creating object to apply
                self.commonQuery.currentQuery.restoreCurrentQuery(savedSearchItem.query);
                self.commonQuery.refreshAll();
                self.populateMembersListPage(savedSearchItem);
                // self.$state.go('app.members');
                self.msg = 'Fetching member list ...';

            }

        },

        cloneSearch:function(savedSearchId){

            //TODO : Allow user to change business owner

            var self = this;

            self.prompt({
                "title": "Copy Saved Search",
                "message": "",
                "input": true,
                "label": "Enter New Search Name",
                "value": ""
            }).then(function(newSearchName){

              /*  console.log("Opening busneisns owenre box now...");
                console.log(self.SavedSearchService.businessOwnerLst);*/

                  /*  self.prompt({
                        "title": "Cloning Saved Search",
                        "message": "",
                        "label": "Enter Business Owner Name",
                        "dropDown":true,
                        "values":self.businessOwnerLst
                    }).then(function(newBusinessOwnerName) {*/

                        self.msg = 'Copying Saved Search ...';
                        self.$timeout(function(){

                            self.SavedSearchService.cloneSearch(savedSearchId,newSearchName,"")  //passing "" for newBusinessOwnerName for now
                                .then(function(){

                                    self.getAllSavedSearches();

                                }, function(){
                                });
                        },3000);


                   /* },function(){
                        self.savedUserSearches.forEach(function(q){
                            q.toBeCloned =false;
                        });
                    });*/
            },function(){
                self.savedUserSearches.forEach(function(q){
                    q.toBeCloned =false;
                });
            });



        },

        getHumanReadableQuery: function(query){

            //TODO: Rewrite for new expression


            var readableQuery = [];
            var arrLen = 0;

            _.forEach(query, function(attributeListObj){

                arrLen  =  attributeListObj.length -1;

                while(arrLen>-1){
                    if(!attributeListObj[arrLen].isCondition) {
                        readableQuery.push(attributeListObj[arrLen].attrName);
                        readableQuery.push(attributeListObj[arrLen].oper);
                        readableQuery.push(attributeListObj[arrLen].attrDisplayValue);

                    } else {
                        readableQuery.push(attributeListObj[arrLen].attrName);
                    }

                    arrLen--;
                }


            });

            return readableQuery.join(' ');

        },

        refreshCount: function(savedSearch){

            var self = this;

           // var savedQueryParam = savedSearch.queryParams.fq[0];

            // Clear all filters
            //this.commonQuery.filterQuery.removeAll();

            // Creating object to apply
            //this.createFiltersList(savedSearch);

            // Refresh All
            //this.commonQuery.refreshAll();

            this.commonQuery.getSavedQueryResultCount(savedSearch.queryParams)
            //this.commonQuery.getQueryResultCount()
           .then(function(data){
                    console.log("refreshCount data : ");
                    console.log(data);
               self.SavedSearchService.refreshSavedSearch(savedSearch,data.response.numFound)  ///, refreshedQueryObj.query, refreshedQueryObj.lastUpdatedOn, refreshedQueryObj.lastMemberCount, latestCount)
                   .then(function (searchResult) {

                       self.getAllSavedSearches();

                   }, function (error) {

                   });


           });







        },

        reflectScheduleChange:function(savedSearchId){

            var appliedQueryObj = _.find(this.savedUserSearches,function(queryObj){
                return savedSearchId == queryObj.searchId;
            });

            appliedQueryObj.hasChanged = appliedQueryObj.isDailyOriginal != appliedQueryObj.isDaily
                                                 || appliedQueryObj.isWeeklyOriginal != appliedQueryObj.isWeekly
                                                 || appliedQueryObj.isMonthlyOriginal != appliedQueryObj.isMonthly
                                                 || appliedQueryObj.isOnDemandOriginal != appliedQueryObj.isOnDemand;

        },

        saveSearchSchedule:function (savedSearchId) {

            var self = this;


            var appliedQueryObj = _.find(this.savedUserSearches,function(queryObj){
                return savedSearchId == queryObj.searchId;
            });

           this.scheduleViewModel
                .getSchedules()
                .then(function(){

                   var assignments = [];

                    var sch =  _(self.scheduleViewModel.scheduleList)
                        .map(function(s) {

                            var every ="";
                            if(s.name==="Daily"){
                                every="-";
                            } else if(s.name==="Weekly"){
                                every="Mo";
                            } else if(s.name==="Monthly"){
                                every=1;
                            } else if(s.name==="On Demand"){
                                every=1;
                            }


                            return {
                                "scheduleId": s.id,
                                "title": s.name,
                                "startDate" : s.startDate,
                                "endDate" : null,
                                "startTime" : s.startTime,
                                "frequency" : s.frequency.code,
                                "every" : every,
                                "createdOn" : s.createdOn
                            }

                        })
                        .value();

                    if(appliedQueryObj.isDaily){
                        assignments.push(sch[0]);
                    }

                    if(appliedQueryObj.isWeekly){
                        assignments.push(sch[1]);
                    }

                    if(appliedQueryObj.isMonthly) {
                        assignments.push(sch[2]);
                    }

                   if(appliedQueryObj.isOnDemand) {
                       assignments.push(sch[3]);
                   }

                    self.scheduleService
                        .updateSingleSearchScheduleAssignments(savedSearchId,assignments)
                        .then(function(res){

                            //Update UI Level Data Structure which already persists in the app( or if user does page refresh, that also refreshes it )
                            appliedQueryObj.isDailyOriginal = appliedQueryObj.isDaily;
                            appliedQueryObj.isWeeklyOriginal = appliedQueryObj.isWeekly;
                            appliedQueryObj.isMonthlyOriginal = appliedQueryObj.isMonthly;
                            appliedQueryObj.isOnDemandOriginal = appliedQueryObj.isOnDemand;

                            self.showScheduleAlert = true;
                            self.$timeout(function(){

                                self.showScheduleAlert = false;

                            },5000);

                        });
                });
        }
    };

}());
