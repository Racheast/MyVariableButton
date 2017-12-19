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
                            variable: {
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
										varList.sort(function(a, b){
											if(a.value < b.value) return -1;
											if(a.value > b.value) return 1;
											return 0;
										})
                                        return varList;
                                    });
                                },
                                expression: "always",
                                ref: "props.variable"
                            },
                            minValue: {
                                ref: "props.minValue",
                                label: "Minimum Value",
                                type: "integer",
                                defaultValue: "0"
                            },
                            maxValue: {
                                ref: "props.maxValue",
                                label: "Maximum Value",
                                type: "integer",
                                defaultValue: "100"
                            },
							steps: {
                                ref: "props.steps",
                                label: "Slider steps",
                                type: "integer",
                                defaultValue: "1"
                            },
                            pipsDensity: {
                                ref: "props.pipsDensity",
                                label: "density of the slider marks",
                                type: "integer",
                                defaultValue: "1"
                            },
							nrOfPipsValues: {
								ref: "props.nrOfPipsValues",
                                label: "Nr of labeled slider marks",
                                type: "integer",
                                defaultValue: "5"
							},
                            selectedValue: {
                                ref: "props.selectedValue",
                                label: "Selected Value",
                                type: "string",
                                defaultValue: "50"
                            }
                        }
                    }
                }
            }
        }
    }
});