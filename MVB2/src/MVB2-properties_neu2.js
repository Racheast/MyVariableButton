define(["qlik"], function(qlik) {

  'use strict';

  return {
       type: "items",
       component: "accordion",
       items: {
          /*
		  toggles:{
			  component: "items",
			  label: "Toggles",
			  items: {
					toggleArray:{
					type: "array",
					label: "Toggle array",
					ref: "toggleArray",
					itemTitleRef: "label",
					allowAdd: true,
					allowRemove: true,
					allowMove: true,
					addTranslation: "Add toggle",
					items: {
						toggleName: {
							type: "string",
							ref: "value",
							label: "Value",
							expression: "optional"
						}
					}
				  }
			  }
		  }
		  */
		  /*
		  variables: {
             component: "items",
             label: "Variables",
             items: {
                variableArray: {
                   type: "array",
                   label: "Variable array",
                   ref: "variableArray",
                   itemTitleRef: "label",
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
		  */
		  toggles: {
             component: "items",
             label: "Toggles",
             items: {
                toggleArray: {
                   type: "array",
                   label: "Toggle array",
                   ref: "variableArray",  //variableArray works! toggleArray doesnt!
                   itemTitleRef: "label",
                   allowAdd: true,
                   allowRemove: true,
                   allowMove: true,
                   addTranslation: "Add toggle",
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
		  ,
          settings: {
             uses: "settings"
          }
       }
    };
});
