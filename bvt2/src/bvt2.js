define(["text!./MVB.ng.html",
        "qlik",
        "./bvt2-properties",
        "css!./css/bvt2.css"], function(templateHTML, qlik, properties) {

   'use strict';

   return {
      initialProperties: {
         variableName: "",
         variableValue: "",
         variableToggle: []
      },
      template: templateHTML,
      definition: properties,
      controller: function($scope) {

         var app = qlik.currApp();
         $scope.toggleIndex = -1;   // Set default toggle to unselected

         // Get current value of the variable and set the correct toggle to active
         if ($scope.layout.variableValue != '') {
             $scope.layout.variableToggle.forEach(function(varItem, index){
               // If toggle value matches current variable value then set to toggled
               if (varItem.value == $scope.layout.variableValue) {
                 $scope.toggleIndex = index;
               }
             });
         } else {
           // If no current variable value (in JS), retrieve value from the variable in the application
           app.variable.getContent($scope.layout.variableName).then(function(curVarValue){
             $scope.layout.variableToggle.forEach(function(varItem, index){
               // If toggle value matches current variable value then set to toggled
               if (varItem.value == curVarValue.qContent.qString) {
                 $scope.toggleIndex = index;
               }
             });
           });
         };

         $scope.toggleVar = function($index) {
            // Set the value of the variable to the toggled option
            $scope.toggleIndex = $index;
            $scope.layout.variableValue = $scope.layout.variableToggle[$scope.toggleIndex].value;
            app.variable.setStringValue($scope.layout.variableName, $scope.layout.variableValue);
         }
		 
		 $scope.showArrays = function() {
			console.log("bvt2: showArrays: variableToggle: " + JSON.stringify($scope.layout.variableToggle));
			console.log("bvt2: showArrays: variableArray: " + JSON.stringify($scope.layout.variableArray));
		 };
      }
   }
});
