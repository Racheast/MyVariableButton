define(["text!./MultipleVariableToggle.ng.html",
        "qlik",
        "./properties",
        "css!./css/bitmetric-variable-toggle.css"], function(templateHTML, qlik, properties) {

   'use strict';

   return {
      initialProperties: {
         variableToggle: []
      },
      template: templateHTML,
      definition: properties,
      controller: function($scope) {

         var app = qlik.currApp();
		 
		 if($scope.layout.toggledIndex > -1){  // A toggle has been selected
			var array = $scope.layout.variableToggle[$scope.layout.toggledIndex].variableArray;
			for(var i=0; i<array.length;i++){
				app.variable.setStringValue(array[i].variableName,array[i].value);
			}
		 }
		 
         $scope.toggleVar = function($index) {  //Function started when a toggle with an $index is clicked in the html template
            $scope.layout.toggledIndex = $index;
			var array = $scope.layout.variableToggle[$scope.layout.toggledIndex].variableArray;
			for(var i=0; i<array.length;i++){
				app.variable.setStringValue(array[i].variableName,array[i].value);
			}
         }
		 
		 
      }
   }
});
