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
                                type: "string",
                                defaultValue: "0"
                            },
                            maxValue: {
                                ref: "props.maxValue",
                                label: "Maximum Value",
                                type: "string",
                                defaultValue: "100"
                            },
                            nrOfPartitions: {
                                ref: "props.nrOfPartitions",
                                label: "Nr. of partitions",
                                type: "string",
                                defaultValue: "5"
                            },
                            partitionWarning: {
                                label: "Warning! Partitions may be displayed wrongly if integer-mode is on.",
                                component: "text"
                            },
                            intOrDec: {
                                type: "boolean",
                                component: "switch",
                                label: "integer / decimal",
                                ref: "props.intOrDec",
                                options: [{
                                    value: true,
                                    label: "decimal"
                                }, {
                                    value: false,
                                    label: "integer"
                                }],
                                defaultValue: true
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