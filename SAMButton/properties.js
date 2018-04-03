define(["qlik"], function(qlik) {

    return {
        type: "items",
        component: "accordion",
        items: {
            settings: {
                uses: "settings",
                items: {
					languages: {  //dropdown maybe causes very long loading times of variables if there's plenty of them
						   label: "Language choice",
						   type: "string",
						   
						   /*
						   component: "dropdown",
						   options: function() {
							  return[{value: "DE", label: "DE"},{value: "EN", label: "EN"}];
						   },
						   */
						   expression: "always",
						   defaultValue: "EN",
						   ref: "props.languageChoice"
						},
					SAMSettings: {
							label:"SAM API Settings",
							items: {
								samProxyURL: {
									label: "SAM Proxy URL",
									type: "string",
									ref: "props.samProxyURL",
									expression: "always"
									//defaultValue: "='http://localhost:8090'"
								},
								endpointURL: {
									label: "SOAP Endpoint URL",
									type: "string",
									ref: "props.endpointURL",
									expression: "always"
								},
								username: {
									label: "Username",
									type: "string",
									ref: "props.username",
									expression: "always"
								},
								password: {
									label: "Password",
									type: "string",
									ref: "props.password",
									expression: "always"
								}
							}
					}
                }
            }
        }
    }
});