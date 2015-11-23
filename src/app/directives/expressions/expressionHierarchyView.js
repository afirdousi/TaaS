(function() {
    'use strict';

    angular
        .module('mainApp')
        .directive('shcExpressionHierarchyView', [
            'nodeChangeTracker',
            ExpressionHierarchyDirective
        ]);

    function ExpressionHierarchyDirective(nodeChangeTracker) {
        return {
            restrict: 'A',
            controller: [
                '$element',
                'd3',
                ExpressionHierarchyDirectiveCtrl
            ],
            scope: {
                expression: '=',
                onExpressionChanged: '&'
            },
            require: ['shcExpressionHierarchyView', '?^shcVerticalScrollPanel'],
            link: function(scope, element, attr, ctrls) {
                var ctrl = ctrls[0], scrollPanelCtrl = ctrls[1];
                scope.$watch(
                    function() {
                        var idList = [];
                        if(scope.expression) {
                            nodeChangeTracker.assembleExpressionNodeIdList(scope.expression.root, idList);
                        }
                        return idList.join(".");
                    },
                    function(x) {
                        scope.onExpressionChanged();
                        if(scope.expression) {
                            ctrl.updateExpression(scope.expression, scrollPanelCtrl);
                        }
                    });
            }
        }
    }

    function ExpressionHierarchyDirectiveCtrl($element, d3) {
        this.element = $element;
        this.d3 = d3;
        this.svg = null;
        this.txGrp = null;
    }

    ExpressionHierarchyDirectiveCtrl.prototype = {

        updateExpression: function(expr, scrollPanelCtrl) {

            var exprStats, svgMinWidth = 500, svgWidth = svgMinWidth, panelWidth;
            if(scrollPanelCtrl) {
                exprStats = expr.getExpressionStatistics();
                svgWidth = Math.max(exprStats.maxDepth * 35, svgMinWidth);
                panelWidth = svgWidth <= svgMinWidth ? "496px" : svgWidth + 'px';
                scrollPanelCtrl.setContentPanelWidth(panelWidth);
            }

            var d3 = this.d3;

            var margin = {top: 30, right: 20, bottom: 30, left: 20},
                width = svgWidth - margin.left - margin.right,
                barHeight = 20,
                barWidth = svgMinWidth * .8;

            var i = 0, duration = 400;

            var tree = d3.layout.tree();
            tree.children(function(n) {
                return n.children;
            });
            tree.nodeSize([0, 20]);

            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.y, d.x]; });

            var svg = this.svg;
            var txGrp = this.txGrp;
            if(!svg) {
                this.svg = svg = d3
                    .select(this.element[0])
                    .append("svg");
                this.txGrp = txGrp = svg
                    .classed('expression-hierarchy', true)
                    .attr("width", svgWidth)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            }
            else {
                svg.attr("width", svgWidth);
            }

            var root = new NodeViewWrapper(expr.root);
            root.x0 = 0;
            root.y0 = 0;
            update(root);

            function update(source) {

                var nodes = tree.nodes(root);

                var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

                svg
                    .transition()
                    .duration(duration)
                    .attr("height", height);

                d3.select(self.frameElement).transition()
                    .duration(duration)
                    .style("height", height + "px");

                // Compute the "layout".
                nodes.forEach(function(n, i) {
                    n.x = i * barHeight;
                });

                // Update the nodes…
                var node = txGrp.selectAll("g.node")
                    .data(nodes, function(d) {
                        return d.id;
                    });

                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                    .style("opacity", 1e-6);

                // Enter any new nodes at the parent's previous position.
                nodeEnter.append("rect")
                    .attr("y", -barHeight / 2)
                    .attr("height", barHeight)
                    .attr("width", barWidth)
                    .style("fill", color)
                    .on("click", click);

                nodeEnter.append("text")
                    .attr("dy", 3.5)
                    .attr("dx", 5.5);

                // Transition nodes to their new position.
                nodeEnter.transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
                    .style("opacity", 1);

                node.transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
                    .style("opacity", 1)
                    .select("rect")
                    .style("fill", color);

                node.selectAll("text")
                    .text(function(d) { return d.displayText; });

                // Transition exiting nodes to the parent's new position.
                node.exit().transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                    .style("opacity", 1e-6)
                    .remove();

                // Update the links…
                var link = txGrp.selectAll("path.link")
                    .data(tree.links(nodes), function(d) { return d.target.id; });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("d", function(d) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                    })
                    .transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function(d) {
                        var o = {x: source.x, y: source.y};
                        return diagonal({source: o, target: o});
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            // Toggle children on click.
            function click(d) {
                d.toggleCollapsed();
                update(d);
            }

            function color(d) {
                return d.isCollapsed ? "#3182bd" : d.hasChildren ? "#c6dbef" : "#fd8d3c";
            }
        }

    };

    function NodeViewWrapper(node) {
        this.node = node;
        this._isCollapsed = false;
        this.children = this._originalChildren = this.node ?
            _.map(this.node.getChildNodes(), function(node) {
                return new NodeViewWrapper(node);
            }) : [];
    }
    NodeViewWrapper.prototype = {
        get isCollapsed() {
            return this._isCollapsed;
        },
        toggleCollapsed: function() {
            if(this.hasChildren) {
                this._isCollapsed = !this._isCollapsed;
                this.children = this._isCollapsed ? [] : this._originalChildren;
            }
        },
        get id() {
            return this.node ? this.node["__expr_node_id__"] : -1;
        },
        get displayText() {
            return this.node ? this.node.displayText : "[Empty]";
        },
        get hasChildren() {
            return this.node && (this.node.children || this.node.child);
        }
    };

}());
