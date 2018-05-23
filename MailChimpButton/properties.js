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
					mailChimpRestSettings: {
							label:"MailChimp Rest Settings",
							items: {
								mailchimpRestProxyURL: {
									label: "MailChimp Proxy URL",
									type: "string",
									ref: "props.mailchimpRestProxyURL",
									expression: "always"
									//defaultValue: "='http://localhost:8090'"
								}
							}
					}
                }
            }
        }
    }
});