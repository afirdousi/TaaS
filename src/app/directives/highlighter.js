(function () {

    "use strict";

    angular.module('mainApp')
        .directive('shcHighlighter', [
            '$timeout',
            function ($timeout) {
                return {
                    restrict: 'A',
                    scope: {
                        textMatch: '=shcHighlighter'
                    },
                    link: function (scope, element) {
                        scope.$watch('textMatch', function (textMatch) {
                            $timeout(function () {
                                var list, regex;

                                list = element.find("td").has("em");
                                list.find("em").contents().unwrap();
                                list.each(function () {
                                    var node = angular.element(this);
                                    node.text(_.map(node.contents(), function (n) {
                                        return n.textContent;
                                    }).join(""));
                                });

                                if (textMatch) {
                                    regex = new RegExp(_.escapeRegExp(textMatch), "gi");
                                    list = element
                                        .find("td")
                                        .contents()
                                        .filter(function () {
                                            return this.nodeType === 3 && this.textContent && regex.test(this.textContent);
                                        })
                                        .each(function () {
                                            var node = angular.element(this);
                                            var content = node.text();
                                            content = content.replace(regex, '<em>$&</em>');
                                            node.replaceWith(content);
                                        });
                                }
                            });
                        });
                    }
                };
            }
        ]);

}());
