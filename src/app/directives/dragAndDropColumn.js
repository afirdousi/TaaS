(function() {
	// body...
	'use strict'

	 angular
        .module('mainApp').directive('droppable', ['$parse', Droppable])
        .module('mainApp').directive('draggable', Draggable)
        .module('mainApp').directive('angTable', ['$compile', AngTable]);

        function Droppable($parse){

        	return {

		      	link: function(scope, element, attr) {

			        function onDragOver(e) {

			          if (e.preventDefault) {
			            e.preventDefault();
			          }

			          if (e.stopPropagation) {
			            e.stopPropagation();
			          }
			          e.dataTransfer.dropEffect = 'move';
			          return false;
			        }

			        function onDrop(e) {
			          	if (e.preventDefault) {
			            	e.preventDefault();
			          	}
			          	if (e.stopPropagation) {
			            	e.stopPropagation();
			          	}
			          	var data = e.dataTransfer.getData("Text");
			          
			          	data = angular.fromJson(data);

			          	var dropfn = attr.drop;
			          	var fn = $parse(attr.drop);
			          	scope.$apply(function() {

			            	scope[dropfn](data, e.target);
			          	});
			        }

		        element.bind("dragover", onDragOver);
		        element.bind("drop", onDrop);
		      }
		    };
        };

        function Draggable(){
        	return {

			    link: function(scope, elem, attr) {

			      	elem.attr("draggable", true);
			      	var dragDataVal='';
			      	var draggedGhostImgElemId='';
			      	attr.$observe('dragdata',function(newVal){
			        	dragDataVal=newVal;
			        
			      	});
			      
			      	attr.$observe('dragimage',function(newVal){
			        	draggedGhostImgElemId=newVal;
			      	});

			      	elem.bind("dragstart", function(e) {
			        	var sendData = angular.toJson(dragDataVal);
			        	e.dataTransfer.setData("Text", sendData);
			        	if (attr.dragimage !== 'undefined') {
			          		e.dataTransfer.setDragImage(document.getElementById(draggedGhostImgElemId), 0, 0);
			        	}

			        var dragFn = attr.drag;
			        if (dragFn !== 'undefined') {
			          	scope.$apply(function() {
			            	scope[dragFn](sendData);
			        	});
			        }
			      });
			    }
			  };
        };

        function AngTable($compile){
        	
        	return {
		      	restrict: 'E',
		      	templateUrl: 'tabletemplate.html',
		      	replace: true,

		      	scope: {
		        	conf: "="
		      	},
		      	controller: function($scope) {

		        	$scope.dragHead = '';
		        	$scope.dragImageId = "dragtable";


		        	$scope.handleDrop = function(draggedData, targetElem) {

		          		var swapArrayElements = function(array_object, index_a, index_b) {
			            	var temp = array_object[index_a];
			            	array_object[index_a] = array_object[index_b];
			            	array_object[index_b] = temp;
		          		};

				        var srcInd = $scope.conf.heads.indexOf(draggedData);
				        var destInd = $scope.conf.heads.indexOf(targetElem.textContent);
				        swapArrayElements($scope.conf.heads, srcInd, destInd);
		        	};

			        $scope.handleDrag = function(columnName) {

			          	$scope.dragHead = columnName.replace(/["']/g, "");
			        };
		      	},
		     	compile: function(elem) {

			        return function(ielem, $scope) {
			          	$compile(ielem)($scope);
			        };
		      	}
		    };
        }
})();

/*var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope) {

  $scope.config = {

    heads: ['name', 'age', 'company', 'tech'],
    myData: [{
      name: 'Jay',
      age: 27,
      company: 'ABC',
      tech: 'Js'
    }, {
      name: 'Rayn',
      age: 30,
      company: 'NBC',
      tech: '.net'
    }]
  };

});
*/