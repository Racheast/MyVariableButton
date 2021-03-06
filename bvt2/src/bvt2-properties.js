define(["qlik"], function(qlik) {

  'use strict';

  return {
       type: "items",
       component: "accordion",
       items: {
          variable: {
             component: "items",
             label: "Variable",
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
						  variableName: {
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
                }
             }
          },
          settings: {
             uses: "settings"
          }
       }
    };
});
