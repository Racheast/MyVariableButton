define(["qlik"], function(qlik) {

  'use strict';

  return {
       type: "items",
       component: "accordion",
       items: {
          variable: {
             component: "items",
             label: "Toggles",
             items: {
                
                variableToggle: {
                   type: "array",
                   label: "Toggles",
                   ref: "variableToggle",
                   itemTitleRef: "toggleName",
                   allowAdd: true,
                   allowRemove: true,
                   allowMove: true,
                   addTranslation: "Add toggle",
                   items: {
					 toggleName: {
							 type: "string",
							 ref: "toggleName",
							 label: "Toggle Name",
							 expression: "optional"
						  },  
                     variableArray: {
					   type: "array",
					   label: "Variable array",
					   ref: "variableArray",
					   itemTitleRef: "variableName",
					   allowAdd: true,
					   allowRemove: true,
					   allowMove: true,
					   addTranslation: "Add variable",
					   items: {
						  /*variableName: {  //dropdown maybe causes very long loading times of variables if there's plenty of them
						   label: "Variable",
						   type: "string",
						   component: "dropdown",
						   options: function() {
							  var app = qlik.currApp();
							  var varList = [];

							  return app.getList("VariableList").then(function(items) {
								 items.layout.qVariableList.qItems.forEach(function(item) {
									varList.push({
									   value: item.qName,
									   label: item.qName
									});
								 });
								 return varList;
							  });
						   },
						   expression: "always",
						   ref: "variableName"
						}*/
						variableName: {
							type: "string",
							ref: "variableName",
							label: "variable name",
							expression: "optional"
						},
						value: {
							 type: "string",
							 ref: "value",
							 label: "Value",
							 expression: "optional"
						  }
					   }
					}
                   }
                },
				toggledIndex:{
					type: "number",
					ref: "toggledIndex",
					label: "toggledIndex",
					defaultValue: "-1"
				},
				info:{
					label:"IMPORTANT: A State Variable is a variable that stores the index of this MultipleVariableToggle's selected toggle-button. Toggle-buttons are indexed according to their listing order. All MultipleVariableToggles that refer to the same State Variable will automatically have selected a toggle-button that has the same index as the one stored in State Variable. Make sure that only IDENTICAL MultipleVariableToggles refer to the same State Variable!",
					component: "text"
				},
				stateVariable: {  //dropdown maybe causes very long loading times of variables if there's plenty of them
						   label: "State Variable (optional)",
						   type: "string",
						   component: "dropdown",
						   options: function() {
							  var app = qlik.currApp();
							  var varList = [];

							  return app.getList("VariableList").then(function(items) {
								 items.layout.qVariableList.qItems.forEach(function(item) {
									varList.push({
									   value: item.qName,
									   label: item.qName
									});
								 });
								 return varList;
							  });
						   },
						   expression: "always",
						   ref: "stateVariable"
				}
				/*stateVariable:{
					type: "string",
					ref: "stateVariable",
					label: "State Variable"
				}*/
             }
          },
          settings: {
             uses: "settings"
          }
       }
    };
});
