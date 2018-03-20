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
		 
		 if($scope.layout.stateVariable != undefined && $scope.layout.stateVariable.length > 0){  //stateVariable has been set
			 getVariableContent($scope.layout.stateVariable).then( (lastToggledIndex)=>{
				 if(lastToggledIndex != undefined && lastToggledIndex != "-"){
					$scope.layout.toggledIndex = lastToggledIndex;
					setVariablesForToggle($scope.layout.toggledIndex);
				 }
				
			 });
		 }else{  //stateVariable hasn't been set
			 if($scope.layout.toggledIndex > -1){  // A toggle has been selected
				setVariablesForToggle($scope.layout.toggledIndex);
			 }
		 }
		 
         $scope.toggleVar = function($index) {  //Function started when a toggle with an $index is clicked in the html template
			app.variable.setStringValue($scope.layout.stateVariable,"" + $index);  //setting the global stateVariable that saves the state of all MultipleVariableToggles that are assigned to it
			$scope.layout.toggledIndex = $index;  
			setVariablesForToggle($scope.layout.toggledIndex);
         }
		 
		 function setVariablesForToggle(index){
			if(index >= 0){	
				var array = $scope.layout.variableToggle[index].variableArray;
				for(var i=0; i<array.length;i++){
					app.variable.setStringValue(array[i].variableName,array[i].value);
				}
			}else{
				console.log("setVariablesForToggle: toggledIndex < 0 !");
			}
		 }
		 
		 function getVariableContent(variableName) {				
				return new Promise(resolve => {
					qlik.currApp().createCube({
						"qDimensions": [{
							"qDef": {
								"qFieldDefs": ["Dummy"]
							}
						}],
						"qMeasures": [{
							"qDef": {
								"qDef": "=$(" + variableName + ")",
								"qLabel": variableName
							}
						}],
						"qInitialDataFetch": [{
							qHeight: 1,
							qWidth: 2
						}]
					}, function(reply) {
						$.each(reply.qHyperCube.qDataPages[0].qMatrix, function(index, value) {						
							var valueArrayText = [];
							resolve(this[1].qText);
						});
					});
				});
		 }
		 
      }
   }
});
