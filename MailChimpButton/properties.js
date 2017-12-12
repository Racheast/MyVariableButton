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
						   component: "dropdown",
						   options: function() {
							  return[{value: "DE", label: "DE"},{value: "EN", label: "EN"}];
						   },
						   expression: "always",
						   ref: "props.languageChoice"
						},
					mailChimpRestSettings: {
							label:"MailChimp Rest Settings",
							items: {
								baseURL: {
									label: "Base-URL",
									type: "string",
									ref: "props.baseURL"
								},
								apiPrefix: {
									label: "API Prefix",
									type: "string",
									ref: "props.apiPrefix"
								},
								mailchimpKey: {
									label: "MailChimp Key",
									type: "string",
									ref: "props.mailchimpKey"
								}
							}
					}
                }
            }
        }
    }
});