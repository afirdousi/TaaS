(function() {
    'use strict';

    var attributesLoadedDeferred;

    angular
        .module('mainApp')
        .service('attributeList', [
            '$q',
            'schemaService',
            AttributeList
        ]);

    function AttributeList($q, schemaService) {
        this.groupsList = [];
        this.attributesList = [];
        this.reportViewList = [];
        this.saleBUList = [];
        this.msmList = [];
        this.$q = $q;
        this.topSearchNoValue = false;
        this.schemaService = schemaService;
        this._loadAttributes();
    }

    AttributeList.prototype = {

        _loadAttributes: function() {

            var self = this;
            attributesLoadedDeferred = self.$q.defer();

            self.$q.all([
                self.schemaService.getGroups(),
                self.schemaService.getAttributes(),
                self.schemaService.getInteractions(),
                self.schemaService.getSalesBU(),
                self.schemaService.getMSM(),
                self.schemaService.getreportViewList()
            ]).then(function(data) {
              //  console.log(data[4]);
                var interactionsGroup;
                var msmGroup;
                var interactionsAttributeName = data[2].UseInteractionsAttributeName;
                var msmAttributeName = data[4].UseMSMAttributeName;

                self.groupsList = _(data[0])
                    .map(function(group) {
                        var attrList = _(data[1])
                            .filter(function(attr) {
                                return attr.Group === group.Group;
                            })
                            .sortBy(function(attr) {
                                return attr.Attribute;
                            })
                            .map(function(attr) {
                                return new Attribute(attr);
                            })
                            .value();
                        return new AttributeGroup(group, attrList);
                    })
                    .value();

                //console.log(self.groupsList);
                self.saleBUList = data[3];

                interactionsGroup = _.find(self.groupsList, function(g) {
                    return g.isInteractionsGroup;
                });


                msmGroup = _.find(self.groupsList, function(g) {
                    return g.isMSMGroup;
                });
              //  console.log(msmGroup);


                self.reportViewList =data[5];
                self.attributesList = _(data[1])
                    .map(function(a) {
                        return new Attribute(a);
                    })
                    .concat(_(data[2].Breakdowns)
                        .filter(function(i) {
                            return !i.Hide;
                        })
                        .map(function(i) {
                            return new Attribute({
                                Attribute: i.Name,
                                Group: interactionsGroup.groupName,
                                AttributeCollectionMapping: interactionsAttributeName,
                                Description: i.Name + " Interaction",
                                UIType: "UncontrolledContains",
                                Prefix: i.Prefix
                            });
                        })
                        .value())
                    .concat(_(data[4].Breakdowns)
                        .map(function(i) {
                            return new Attribute({
                                Attribute: i.description,
                                Group: msmGroup.groupName,
                                Format: i.format,
                                BU: i.BU,
                                AttributeCollectionMapping: msmAttributeName,
                                Description: i.description,
                                UIType: "UncontrolledContains",
                                Prefix: i.name,
                                IsMSM: true,
                                IsTopSearch: false,
                                IsAll: false,
                            });
                        })
                        .value())
                    .sortBy(function(attr) {
                        return attr.attrName;
                    })
                    .value();


                interactionsGroup.attributes = _(data[2].Breakdowns)
                    .filter(function(i) {
                        return !i.Hide;
                    })
                    .sortBy(function(i) {
                        return i.Name;
                    })
                    .map(function(i) {
                        return new Attribute({
                            Attribute: i.Name,
                            Group: interactionsGroup.groupName,
                            AttributeCollectionMapping: interactionsAttributeName,
                            Description: i.Name + " Interaction",
                            UIType: "UncontrolledContains",
                            Prefix: i.Prefix
                        });
                    })
                    .value();

               // self.msmList = data[4];
                msmGroup.attributes = _(data[4].Breakdowns)
                    .sortBy(function(i) {
                        return i.description;
                    })
                    .map(function(i) {
                        return new Attribute({
                            Attribute: i.description,
                            Group: msmGroup.groupName,
                            Format: i.format,
                            BU: i.BU,
                            AttributeCollectionMapping: msmAttributeName,
                            Description: i.description,
                            UIType: "UncontrolledContains",
                            Prefix: i.name,
                            IsMSM: true,
                            IsTopSearch: false,
                            IsAll: false,
                        });
                    })
                    .value();

                attributesLoadedDeferred.resolve();

            }, function() {
                attributesLoadedDeferred.reject();
            });
        },

        filterAttributesByName: function(name) {
            var regex = new RegExp(escapeRegExp(name), "i");
            _(this.groupsList)
                .map(function(group) {
                    return group.attributes;
                })
                .flatten()
                .concat(this.attributesList)
                .value()
                .forEach(function(attr) {
                    if(name) {
                        attr.isVisible = regex.test(attr.attrName);
                    }
                    else {
                        attr.isVisible = true;
                    }
                });

          /*  this.groupsList.forEach(function(group) {
                group.isExpanded = !!name && group.visibleCount > 0;
            });*/
        },

        collapseAllAttributes: function() {
            _(this.groupsList)
                .map(function(group) {
                    return group.attributes;
                })
                .flatten()
                .concat(this.attributesList)
                .value()
                .forEach(function(attr) {
                    attr.isExpanded = false;
                });
        },

        findGroup: function(groupName) {
            return _.find(this.groupsList, function(g) {
                return g.groupName === groupName;
            });
        },

        findIconClass: function(attr) {
            var group = this.findGroup(attr.attrGroupName);
            return group ? group.iconClass : "";
        },

        afterAttributesLoaded: function() {
            return attributesLoadedDeferred.promise;
        },

        loadReportAttributesList: function(){
            return this.schemaService.getreportViewList();
        },

        setTopSearchNoValue: function(value){

          this.topSearchNoValue = value;
        }

    };

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function AttributeGroup(group, attrList) {
        this.groupName = group.Group;
        this.iconClass = group.Class;
        this.isInteractionsGroup = !!group.IsInteractions;
        this.isMSMGroup = group.IsMSM;
        this.attributes = attrList;
        this.isExpanded = false;
        this.hideGroup  = group.HideGroup;
        this.IsProfileOnly =group.IsProfileOnly ;
        this.IsSalesAndTransTab=group.IsSalesAndTransTab;
        this.IsSYWProfile = group.IsSYWProfile;
        this.SearchOnly = group.SearchOnly;
        this.IsGeographyTab = group.IsGeographyTab;

    }

    AttributeGroup.prototype = {
        get visibleCount() {
            return _.reduce(this.attributes, function(sum, attr) {
                return sum + (attr.isVisible ? 1 : 0);
            }, 0);
        },
        get attributeCount() {
            return this.attributes.length;
        },
        toggleExpanded: function() {
            this.isExpanded = !this.isExpanded;
        }
    };

    function Attribute(attr) {
        this.attrName = attr.Attribute;
        this.attrGroupName = attr.Group;
        this.attrKey = attr.AttributeCollectionMapping;
        this.attrKeySYW = attr.AttributeCollectionMappingSYW;
        this.description = attr.Description;
        this.controlType = attr.UIType;
        this.KeyName = attr.KeyName;
        this.IsTopSearch = attr.IsTopSearch;
        this.IsGeographyTab = attr.IsGeographyTab;
        this.IsWebSocial = attr.IsWebSocial;
        this.IsRange = attr.IsRange;
        this.IsNoMinMax = attr.IsNoMinMax;
        this.IsInteger = attr.IsInteger;
        this.isPrefix = attr.isPrefix;
        this.IsContactDetails = attr.IsContactDetails;
        this.ReportingGroup = attr.ReportingGroup;
        this.IsMSM = attr.IsMSM;
        this.IsAll = attr.IsAll;
        this.IsNewUIDate = attr.IsNewUIDate;
        this.IsMemberPoints = attr.IsMemberPoints;
        this.IsTopMSASegments = attr.IsTopMSASegments;
        this.IsSlider = attr.IsSlider;



        if (attr.IsAllNone === undefined) {
            this.IsAllNone = false;
        }
        else {

            this.IsAllNone = attr.IsAllNone;
        }

        if (attr.IsAll === undefined) {
            this.IsAll = true;
        }
        else {

            this.IsAll = attr.IsAll;
        }
        
        if (attr.SYW === undefined) {
            this.SYW = false;
        }
        else {

            this.SYW = attr.SYW;
        }

        if(attr.Gold === undefined ){
            this.Gold =false;
        }else {
            this.Gold = attr.Gold;
        }

        if(attr.IsTopSearch === undefined ){
            this.IsTopSearch =true;
        }else {
            this.IsTopSearch = attr.IsTopSearch;
        }

        this.DisplayOrder = attr.DisplayOrder;
        if(attr.IsAttribute === undefined)
        {
            this.IsAttribute = true;
        }
        else {
            this.IsAttribute = attr.IsAttribute;
        }
        
        this.prefix = attr.Prefix;
        this.isExpanded = false;
        this.isVisible = true;
        this.format = attr.Format;
        this.BU = attr.BU;

        if(attr.UIType === "DrillDown") {
            this.levels = attr.Levels;
            this.levelsPrefix = attr.LevelsPrefix || "";
        }
        if(attr.UIType === "DrillDownSpecial") {
            this.levels = attr.Levels;
            this.levelsPrefix = attr.LevelsPrefix || "";
        }
        if(attr.UIType === "GroupingType") {
            this.values = attr.Levels;
         //   this.levelsPrefix = attr.LevelsPrefix || "";
        }
    }

    Attribute.prototype = {
        toggleExpanded: function() {
            this.isExpanded = !this.isExpanded;
        }
    };

})();