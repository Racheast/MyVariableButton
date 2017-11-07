define(["text!./MVB.ng.html",
        "qlik",
        "./MVB2-properties_neu2",
        "css!./css/MVB2.css"], function(templateHTML, qlik, properties) {

   'use strict';

   return {
      initialProperties: {
         //toggleArray: [],
		 //variableArrayX: []
      },
      template: templateHTML,
      definition: properties,
      controller: function($scope) {
        var app = qlik.currApp();

         $scope.toggleVar = function($index) {
            // Set the value of the variable to the toggled option
            $scope.toggleIndex = $index;
            $scope.layout.variableValue = $scope.layout.variableArray[$scope.toggleIndex].value;
            app.variable.setStringValue($scope.layout.variableName, $scope.layout.variableValue);
         };
				
		$scope.sayHello2 =function(){
				console.log("MVB2: variableArray: " + JSON.stringify($scope.layout.variableArray));
		};
		
		$scope.setVariables = function(){
			for(var i=0; i < $scope.layout.variableArray.length; i++){
				console.log("setVariables: varName: " + $scope.layout.variableArray[i].variableName + ", varValue: " + $scope.layout.variableArray[i].value);
				app.variable.setStringValue($scope.layout.variableArray[i].variableName, $scope.layout.variableArray[i].value);
			}
		};
		
		$scope.showArrays = function(){
			console.log("MVB2: showArrays: toggleArray: " + JSON.stringify($scope.layout.toggleArray));
			console.log("MVB2: showArrays: variableArray: " + JSON.stringify($scope.layout.variableArray));
		}
      }
   }
});
