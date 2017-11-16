define(["qlik"], function(qlik) {

    return {
        type: "items",
        component: "accordion",
        items: {
            settings: {
                uses: "settings",
                items: {
                    sliderSettingsHeader: {
                        type: "items",
                        label: "Slider Settings",
                        items: {
                            
							variableLowerBound: {
                                label: "Variable Lower Bound",
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
										varList.sort(function(a, b){
											if(a.value < b.value) return -1;
											if(a.value > b.value) return 1;
											return 0;
										})
                                        return varList;
                                    });
                                },
                                expression: "always",
                                ref: "props.variableLowerBound"
                            },
							
							variableUpperBound: {
                                label: "Variable Upper Bound",
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
										varList.sort(function(a, b){
											if(a.value < b.value) return -1;
											if(a.value > b.value) return 1;
											return 0;
										})
                                        return varList;
                                    });
                                },
                                expression: "always",
                                ref: "props.variableUpperBound"
                            },
                            minValue: {
                                ref: "props.minValue",
                                label: "Minimum Value",
                                type: "number",
                                defaultValue: "0",
								expression: "optional"
                            },
                            maxValue: {
                                ref: "props.maxValue",
                                label: "Maximum Value",
                                type: "number",
                                defaultValue: "100",
								expression: "optional"
                            },
                            selectedValueLowerBound: {
                                ref: "props.selectedValueLowerBound",
                                label: "Lower Selected Value",
                                type: "number",
                                defaultValue: "10",
								expression: "optional",
								show: "true"
                            },
							selectedValueUpperBound: {
                                ref: "props.selectedValueUpperBound",
                                label: "Upper Selected Value",
                                type: "number",
                                defaultValue: "90",
								expression: "optional"
                            }
							
                        }
                    }
                }
            }
        }
    }
});