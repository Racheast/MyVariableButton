define( [
		"qlik",
		"./properties",
		"jquery"
	],
	function ( qlik, props, $) {

	return {
		initialProperties : {  
			 qHyperCubeDef : {  
				  qDimensions : [],  
				  qMeasures : [],  
				  qInitialDataFetch : [{  
					   qTop: 0, 
					   qWidth: 20, 
					   qLeft: 0, 
					   qHeight: 455
				  }]  
			 }  
		}, 
		definition:props,
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		paint: function ($element, layout) {
			
			var html = '<div><input type="text" id="targetCode" placeholder="Targetcode" style="width:40%"></div>';
			html += '<div><button type="submit" id="createTarget" style="width:40%">' + getMessage(layout.props.languageChoice, "buttonText") + '</button></div>';
			//html += '<div id="dialog" title="Basic dialog"><p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the "x" icon.</p></div>';
			//html += '<div><button type="submit" id="addUpdateUsers" >Add/update users to a list</button></div>';
			//html += '<div><button type="submit" id="getSomething" >get something</button></div>';
							
			
			//USEFUL !!!
			//https://community.qlik.com/blogs/qlikviewdesignblog/2016/10/14/getting-all-data-cells-from-appcreatecube
			
			$element.html(html);  //works only in paint()
			
			function getMessage(languageChoice, type){
				var message = "";
				if(languageChoice == ""){
					console.log("Here");
					message = "**Please select a language in the extension settings.**";
				}else if(languageChoice == "DE"){
					switch(type){
						case "success":
							message = "Target wurde erstellt.";
							break;
						case "noSegmentName":
							message = "Bitte geben Sie einen Targetcode an.";
							break;
						case "buttonText":
							message = "Target mit Email-Adressen erstellen"
							break;
					}
				}else if(languageChoice == "EN"){
					switch(type){
						case "success":
							message = "Target has been created.";
							break;
						case "noSegmentName":
							message = "Please enter a targetcode.";
							break;
						case "buttonText":
							message = "create target with email-addresses";
							break;
					}
				}
				return message;
			}
			
			$("#createTarget").click(function(){
				console.log("trying post...");
				var targetCode = $("#targetCode").val();
				
				if(targetCode.length != 0){	
					var campaignTarget = {
						"code" : targetCode,
						"internalName" : targetCode, //TODO: textfield for entering an internal name
						"contactNumbers" : ["12","23"]
					};
					createOrUpdateTarget(campaignTarget);
				}else{
					alert("Please enter a segment name.");
				}
			});
			
			
			function createOrUpdateTarget(target){
				var endpointURL = "https://cube.ws.secutix.com/tnco/external-remoting/com.secutix.service.campaign.v1_0.ExternalCampaignService.webservice?wsdl";
				var username =  "CUBE_B2C";
				var password = "P@ssw0rd";
				var requestURL = "http://localhost:8080/createOrUpdateTarget?soapEndpointURL=" + endpointURL + "&username=" + username + "&password=" + password;
				
				console.log("Calling createOrUpdateTarget...");
				$.ajax({
					url: requestURL,
					//url: 'http://zwirn:8887/createSegment?vApiPrefix=us13&baseURL=.api.mailchimp.com/3.0/&vMCKey=e0efd872132071dee9ba6c0eb6067e8d&vMCList=8af007a903',
					type: 'post',
					data: JSON.stringify(target),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					dataType: 'json',
					success: function(data) {
						console.log("createOrUpdateTarget: SUCCESS: data: " + JSON.stringify(data));
						alert(getMessage(layout.props.languageChoice,"success"));
					},
					error: function(data) {
						console.log("Data.statustext: " + data.statusText);
						alert(data.statusText);
					}
				});
			}
		}
	};

} );

