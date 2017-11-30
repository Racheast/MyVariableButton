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