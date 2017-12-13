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
				}
             }
          },
          settings: {
             uses: "settings"
          }
       }
    };
});
