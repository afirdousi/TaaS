(function() {
    'use strict';

    angular
        .module('mainApp')
        .service('nodeChangeTracker', [
            NodeChangeTracker
        ])
        .directive('shcExpressionView', [
            'nodeChangeTracker',
            ExpressionView
        ]);

    // Used for change tracking in the expression
    var nextExpressionNodeId = 0;
    var nodeIdPropertyName = "__expr_node_id__";
    function NodeChangeTracker() { }
    NodeChangeTracker.prototype = {
        getExpressionNodeId: function(node) {
            var nodeId = node[nodeIdPropertyName];
            if(!nodeId) {
                node[nodeIdPropertyName] = nodeId = (nextExpressionNodeId += 1);
                node.removeExpressionNodeId = function() {
                    delete this[nodeIdPropertyName];
                };
            }
            return nodeId;
        },
        removeExpressionNodeId: function(node) {
            delete node[nodeIdPropertyName];
        },
        assembleExpressionNodeIdList: function(node, idList) {
            if(node) {
                idList.push(this.getExpressionNodeId(node));
                _.each(node.getChildNodes(), function(child) {
                    this.assembleExpressionNodeIdList(child, idList);
                }, this);
            }
        }
    };

    function ExpressionView(nodeChangeTracker) {
        return {
            restrict: 'A',
            controller: [
                '$element',
                '$scope',
                '$compile',
                'Expression',
                ExpressionViewCtrl
            ],
            templateUrl: 'app/directives/expressions/expressionView.html',
            scope: {
                expression: '=',
                onExpressionUpdated: '&'
            },
            controllerAs: 'expr',
            bindToController: true,
            require: ['shcExpressionView', '?^shcVerticalScrollPanel'],
            link: function(scope, element, attr, ctrls) {

                var ctrl = ctrls[0], scrollPanelCtrl = ctrls[1];
                attr.$addClass('expression-view');

                // Watch for changes in the expression
                scope.$watch(
                    function() {
                        var idList = [];
                        if(ctrl.expression) {
                            nodeChangeTracker.assembleExpressionNodeIdList(ctrl.expression.root, idList);
                        }
                        return idList.join(".");
                    },
                    function() {
                        if(ctrl.expression) {
                            ctrl.updateView(ctrl.expression, scrollPanelCtrl);
                            ctrl.onExpressionUpdated();
                        }
                    });
            }
        }
    }

    function ExpressionViewCtrl($element, $scope, $compile, Expression) {
        this.element = $element;
        this.$scope = $scope;
        this.$compile = $compile;
        this.Expression = Expression;
        this.nodeMap = new ExpressionNodeMap();
    }

    ExpressionViewCtrl.prototype = {

        get isAppendToNewGroupMode() {
            return this.expression && this.expression.appendMode === this.Expression.AppendAsNewGroup;
        },

        get isAppendToExpressionMode() {
            return this.expression && this.expression.appendMode === this.Expression.AppendToExpression;
        },

        selectAppendToNewGroupMode: function() {
            if(this.expression) {
                this.expression.appendMode = this.Expression.AppendAsNewGroup;
            }
        },

        selectAppendToExpressionMode: function() {
            if(this.expression) {
                this.expression.appendMode = this.Expression.AppendToExpression;
            }
        },

        toggleAppendToExpressionMode: function() {
            if(this.isAppendToExpressionMode) {
                this.selectAppendToNewGroupMode();
            }
            else if(this.isAppendToNewGroupMode) {
                this.selectAppendToExpressionMode();
            }
        },

        updateView: function(expression, scrollPanelCtrl) {

            var exprStats, panelWidth;
            //
            if(scrollPanelCtrl) {
                exprStats = expression.getExpressionStatistics();
                panelWidth = exprStats.maxDepth * 24;
                panelWidth = panelWidth < 500 ? "496px" : panelWidth + 'px';
                scrollPanelCtrl.setContentPanelWidth(panelWidth);
            }
            var nodeMap = new ExpressionNodeMap();
            var viewRoot = this._mapExpressionToView(expression, expression.root, nodeMap);
            this.$scope.nodeMap = nodeMap.nodeMap;

            var directives = _.flattenDeep(this._buildDirectivesList(viewRoot, 0)).join("\n");
            //console.log(directives);
            var newElements = angular.element(directives);

            var panel = this.element.find(".expr-view-panel");
            panel.empty();
            panel.append(newElements);
            this.$compile(newElements)(this.$scope);
        },
      

        _mapExpressionToView: function(expression, node, nodeMap) {
            var Expression = this.Expression;
            var mapExpressionToView = this._mapExpressionToView.bind(this);
            var item, childItem;
           
            if(_.isObject(node)) {
                if(node instanceof Expression.AndOperator) {
                    item = addChildrenOfOperator(AndOperatorHandler);
                }
                else if(node instanceof Expression.OrOperator) {
                    item = addChildrenOfOperator(OrOperatorHandler);
                }
                else if(node instanceof Expression.NotOperator || node instanceof Expression.GroupOperator) {
                    childItem = mapExpressionToView(expression, node.child, nodeMap);
                    if(childItem instanceof GroupHandler) {
                        item = childItem;
                        item.node = node;
                    }
                    else {
                        item = nodeMap.addItem(new GroupHandler(expression, node, Expression));
                        item.children = [childItem];
                    }
                }
                else {
                    if(_.isFunction(node.negate)) {
                        item = nodeMap.addItem(new AttributeHandler(expression, node))
                    }
                    else {
                        item = nodeMap.addItem(new GroupHandler(expression, node, Expression));
                        item.children = [
                            nodeMap.addItem(new AttributeHandler(expression, node))
                        ];
                    }
                }
            }
            return item;

            function addChildrenOfOperator(handlerType) {
                var item = nodeMap.addItem(new GroupHandler(expression, node, Expression));
                item.children = _(node.children)
                    .map(function(child, idx) {
                        var handler, items = [];
                        if(idx > 0) {
                            handler = new handlerType(expression, node, node.children[idx-1], node.children[idx]);
                            items.push(nodeMap.addItem(handler));
                        }
                        items.push(mapExpressionToView(expression, child, nodeMap));
                        return items;
                    }, this)
                    .flatten()
                    .value();
                return item;
            }
        },

        _buildDirectivesList: function(viewNode, depth) {
            var prefix;
            if(!viewNode) {
                return [];
            }
            prefix = new Array(depth+1).join('  ');
            return [
                [
                    prefix,
                    '<div ',
                    viewNode.directive,
                    ' handler="nodeMap[',
                    viewNode.nodeMapId,
                    ']" class="',
                    viewNode.className,
                    '">'
                ].join(''),
                _.map(viewNode.children, function(child) {
                    return this._buildDirectivesList(child, depth+1);
                }, this),
                [prefix, '</div>'].join('')
            ];
        }

    };

    // Used to map expression nodes to the expression directives
    function ExpressionNodeMap() {
        this._nextNodeMapId = 0;
        this._nodeMap = {};
    }
    ExpressionNodeMap.prototype = {
        get nodeMap() {
            return this._nodeMap;
        },
        nextNodeMapId: function() {
            return this._nextNodeMapId += 1;
        },
        addItem: function(item) {
            item.nodeMapId = this.nextNodeMapId();
            this.nodeMap[item.nodeMapId] = item;
            return item;
        }
    };

    // AND handler
    function AndOperatorHandler(expression, node, nodeOne, nodeTwo) {
        this.directive = 'shc-expression-and-or-toggle';
        this.className = 'expr-and-or';
        this.expression = expression;
        this.node = node;
        this.nodeOne = nodeOne;
        this.nodeTwo = nodeTwo;
        this.children = [];
    }
    AndOperatorHandler.prototype = {
        convertToOROperator: function() {
            this.expression.changeFromAndToOr(this.node, [this.nodeOne, this.nodeTwo]);
            this.refreshExpression();
        },
        refreshExpression: function() {
            if(_.isFunction(this.node.removeExpressionNodeId)) {
                this.node.removeExpressionNodeId();
            }
        }
    };

    // OR handler
    function OrOperatorHandler(expression, node, nodeOne, nodeTwo) {
        this.directive = 'shc-expression-and-or-toggle';
        this.className = 'expr-and-or';
        this.expression = expression;
        this.node = node;
        this.nodeOne = nodeOne;
        this.nodeTwo = nodeTwo;
        this.children = [];
    }
    OrOperatorHandler.prototype = {
        convertToANDOperator: function() {
            this.expression.changeFromOrToAnd(this.node, [this.nodeOne, this.nodeTwo]);
            this.refreshExpression();
        },
        refreshExpression: function() {
            if(_.isFunction(this.node.removeExpressionNodeId)) {
                this.node.removeExpressionNodeId();
            }
        }
    };

    // Group (and NOT) handler
    function GroupHandler(expression, node, Expression) {
        this.directive = 'shc-expression-group';
        this.className = 'expr-group';
        this.expression = expression;
        this.Expression = Expression;
        this.node = node;
        this.children = [];
    }
    GroupHandler.prototype = {
        get isSelectable() {
            return this.node instanceof this.Expression.GroupOperator;
        },
        get isNegatable() {
            return !(this.node instanceof this.Expression.GroupOperator &&
                    this.node.child &&
                    _.isFunction(this.node.child.negate));
        },
        get isSelected() {
            return this.isSelectable ? this.node.isCurrentContextGroup : false;
        },
        set isSelected(value) {
            if(this.isSelectable) {
                this.expression.selectCurrentContextGroup(value ? this.node : null);
            }
        },
        negateItem: function() {
            this.expression.negate(this.node);
            this.refreshExpression();
        },
        refreshExpression: function() {
            if(_.isFunction(this.node.removeExpressionNodeId)) {
                this.node.removeExpressionNodeId();
            }
        },
        get isNegated() {
            var Expression = this.Expression;
            if(this.node instanceof Expression.GroupOperator) {
                return this.node.child && this.node.child.isNegated;
            }
            return this.node.isNegated;
        },
        removeItem: function() {
            this.expression.remove(this.node);
        },
        get isAppendToNewGroupMode() {
            return this.expression && this.expression.appendMode === this.Expression.AppendAsNewGroup;
        },
        get isAppendToExpressionMode() {
            return this.expression && this.expression.appendMode === this.Expression.AppendToExpression;
        },
        toggleAppendToExpressionMode: function($event, value) {
            $event.stopPropagation();
            $event.preventDefault();
            if(this.expression) {
                if(!this.isSelected) {
                    this.isSelected = true;
                }
                if(value) {
                    this.expression.appendMode = value;
                }
                else {
                    if (this.isAppendToExpressionMode) {
                        this.expression.appendMode = this.Expression.AppendAsNewGroup;
                    }
                    else if (this.isAppendToNewGroupMode) {
                        this.expression.appendMode = this.Expression.AppendToExpression;
                    }
                }
            }
        },
        get appendToExpressionText() {
            if(this.expression) {
                if (this.isAppendToExpressionMode) {
                    return "Append";
                }
                else if (this.isAppendToNewGroupMode) {
                    return "Subgroup";
                }
            }
            return "";
        }
    };

    // Attribute (and NOT) handler
    function AttributeHandler(expression, node) {
        this.directive = 'shc-expression-attribute';
        this.className = 'expr-attr';
        this.expression = expression;
        this.node = node;
        this.children = [];
    }
    AttributeHandler.prototype = {
        negateItem: function() {
            this.expression.negate(this.node);
            this.refreshExpression();
        },
        removeItem: function() {
            this.expression.remove(this.node);
        },
        refreshExpression: function() {
            if(_.isFunction(this.node.removeExpressionNodeId)) {
                this.node.removeExpressionNodeId();
            }
        }
    };

}());