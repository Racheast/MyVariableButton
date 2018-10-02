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
			
			//var html = '<div><form><input type="text" id="targetCode" placeholder="Targetcode" style="width:40%;" required/></div>';
			//html += '<div><input type="text" id="internalName" placeholder="Internal name" style="width:40%;" required/></div>';
			var html = '<div><select id="organization" name="organization" style="width:40%">' + getOrganizationOptions() + '</select></div>';
			html += '<div><button type="submit" id="createTarget" style="width:40%">' + getMessage(layout.props.languageChoice, "buttonText") + '</button></div>';
			html += '<p id="targetCodeError" style="color:red;"></p>';
			html += '<p id="internalNameError" style="color:red;"></p></form>';
			
			$element.html(html); 
			
			getAllTargetCodes().then((targetCodes) => {  //get all TargetCodes first. Only then enable button-click and button-change events!
				console.log("TargetCodes received in main code! TargetCodes: ");
				console.log(targetCodes);
				
				var targetCodeOK = true;
				var internalNameOK = true;
				/*
				//validate targetcode
				$('#targetCode').bind('input propertychange', function() {
					//if targetCode already in use
					if($.inArray(this.value.toLowerCase(),  $.map(targetCodes, function(n,i){return n.toLowerCase();}))>-1){  //transform textarea input and targetCodes to lowercase
						targetCodeOK = false;
						$('#targetCode').css('color', 'red');
						$("#createTarget").hide()
						$("#targetCodeError").text(getMessage(layout.props.languageChoice, "targetCodeNotAvailable"));
					}
					else if($('#targetCode').val().length > 8){  //targetcode length > 8
						targetCodeOK = false;
						$('#targetCode').css('color', 'red');
						$("#createTarget").hide()
						$("#targetCodeError").text(getMessage(layout.props.languageChoice, "targetCodeTooLong"));
					}else if(validateString($('#targetCode').val())==false) {  //targetcode doesn't match regex
						targetCodeOK = false;
						$('#targetCode').css('color', 'red');
						$("#createTarget").hide()
						$("#targetCodeError").text(getMessage(layout.props.languageChoice, "targetCodeNotAlphaNumeric"));
					}
					else{  //targetcode is OK
						targetCodeOK = true;
						$('#targetCode').css('color', 'black');
						$("#targetCodeError").text("");
						if(internalNameOK == true){
							$("#createTarget").show()
						}
					}
				});
				*/
				/*
				//validate internalName
				$('#internalName').bind('input propertychange', function() {
					if($('#internalName').val().length > 60){  //internalName length > 60
						internalNameOK = false;
						$('#internalName').css('color', 'red');
						$("#createTarget").hide()
						$("#internalNameError").text(getMessage(layout.props.languageChoice, "internalNameTooLong"));
					}else if(validateString($('#internalName').val())==false) {
						$('#internalName').css('color', 'red');
						$("#createTarget").hide()
						$("#internalNameError").text(getMessage(layout.props.languageChoice, "internalNameNotAlphaNumeric"));
					}
					else{  //internalName is OK
						internalNameOK = true;
						$('#internalName').css('color', 'black');
						$("#internalNameError").text("");
						if(targetCodeOK == true){
							$("#createTarget").show();
						}
					}
				});
				*/
				$("#createTarget").click(function(){  //button click handling
					console.log("createTarget called");
					
					//var targetCode = $("#targetCode").val();
					//var internalName = $("#internalName").val();
					var targetCode = generateTargetCode();
					var internalName = generateInternalName();
					var organization = $("#organization").val();
					var errors = validateProperties();
					
					/*
					if(targetCode.length == 0){
						errors.push(getMessage(layout.props.languageChoice, "targetCodeNotSet"));
					}
					
					if(internalName.length == 0){
						errors.push(getMessage(layout.props.languageChoice, "internalNameNotSet"));
					}
					*/
					if(errors.length == 0){	
						createHyperCube(organization, targetCode, internalName);
					}
					else{
						var errormessage="";
						for(var i=0; i<errors.length; i++){
							errormessage += errors[i] + "\n";
						}
						alert(errormessage);
					}
					
				});
			});
			
			//TODO
			function getOrganizationOptions(){
				var organizationOptions = "";
				organizationOptions += "<option>testOrg1</option><option>testOrg2</options>";
				return organizationOptions;
			}
			
			function generateTargetCode(){
				var randomString = "";
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				
				for (var i = 0; i < 6; i++)
					randomString += possible.charAt(Math.floor(Math.random() * possible.length));
				
				return $("#organization").val().substring(0,2) + randomString;
			}
			
			function generateInternalName(){
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var hours = today.getHours();
				var minutes = today.getMinutes();
				var yyyy = today.getFullYear();
				if(dd<10){
					dd='0'+dd;
				} 
				if(mm<10){
					mm='0'+mm;
				} 
				return  "DataAnaalyTix_" + dd + '/' + mm + '/' + yyyy + '_' + hours + ':' + minutes;
			}
			
			function createOrUpdateTarget(target){
				//var endpointURL = layout.props.endpointURL; //"https://cube.ws.secutix.com/tnco/external-remoting/com.secutix.service.campaign.v1_0.ExternalCampaignService.webservice?wsdl";
				//var username =  layout.props.username;//"CUBE_B2C";
				//var password = layout.props.password;"P@ssw0rd";
				var institutionCode = layout.props.institutionCode;
				var samProxyURL = layout.props.samProxyURL;
				var requestURL = samProxyURL + "/createOrUpdateTarget?institutionCode=" + institutionCode;//?soapEndpointURL=" + endpointURL + "&username=" + username + "&password=" + password;
				
				console.log("Calling createOrUpdateTarget ...");
				
				$.ajax({
					url: requestURL,
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
						//prepare error output message
						var errors="";
						if(data.responseJSON != undefined && data.responseJSON.validationErrors != null){
							for(var i = 0; i < data.responseJSON.validationErrors.length; i++){
								var validationError = data.responseJSON.validationErrors[i];
								errors += validationError.field + ": " + validationError.defaultMessage + "\n";
							}
						}
						if(data.responseJSON != undefined && data.responseJSON.samError != null){
							errors+= data.responseJSON.samError.statusCode + ": " + data.responseJSON.samError.statusDetail + "\n";
						}
						console.log("Response data: " + JSON.stringify(data));
						console.log("Error!\n" + errors);
						alert("Error!\n" + errors);
					}
				});
				
			}		
			
			function validateProperties(){
				var errors = [];
				if(layout.props.languageChoice == undefined || layout.props.languageChoice.length == 0){
					errors.push("Property languageChoice is undefined!");
				}
				return errors;
			}
			
			function getAllTargetCodes(){
				var targetCodes = [];
				var dim = ["TARGET_CODE"];
				var fltr = qlik.currApp().createTable(dim, ["=count({1<[%KUNDE]=,[TARGET_CODE]-={'-'}>}TARGET_CODE)"], {rows:1000});

				return new Promise(resolve => {		
					fltr.OnData.bind(function () {
						for(var i=0; i < fltr.qHyperCube.qDataPages[0].qMatrix.length; i++){
							var row = fltr.qHyperCube.qDataPages[0].qMatrix[i];
							//console.log("qtext: " + row[0].qText);
							targetCodes.push(row[0].qText);
						}
						resolve(targetCodes);
					});
					
				});	
				
			}
			
			function validateString(string) {
				var pattern = /^[A-Za-z0-9]*$/;
				return $.trim(string).match(pattern) ? true : false;
			}
			
			function getMessage(languageChoice, type){  //for translation purposes
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
							message = "Target nach SAM exportieren"
							break;
						case "targetCodeNotAvailable":
							message = "Targetcode wird bereits verwendet. Bitte wählen Sie einen anderen Targetcode.";
							break;
						case "targetCodeNotSet":
							message = "Bitte geben Sie den Targetcode ein.";
							break;
						case "targetCodeTooLong":
							message = "Targetcode darf aus höchstens 8 Zeichen bestehen.";
							break;
						case "targetCodeNotAlphaNumeric":
							message = "Targetcode darf nur aus (englischen) Klein- und Großbuchstaben sowie aus Zahlen bestehen.";
							break;
						case "internalNameTooLong":
							message = "Internal name darf aus höchstens 60 Zeichen bestehen.";
							break;
						case "internalNameNotSet":
							message = "Bitte geben Sie einen Internal Name ein.";
							break;
						case "internalNameNotAlphaNumeric":
							message = "Internal name darf nur aus (englischen) Klein- und Großbuchstaben sowie aus Zahlen bestehen.";
							break;
						case "noOrTooManyContactNumbers":
							message = "Ein Campaign Target muss mindestens 1 und höchstens 50000 Contact Numbers beinhalten.";
							break;
						case "samSuccess":
							message = "Target wurde erfolgreich erstellt.";
							break;
						case "samError":
							message = "Es gab ein Problem bei der Erstellung des Targets."
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
							message = "Export target to SAM";
							break;
						case "targetCodeNotAvailable":
							message = "Targetcode is already in use. Please choose another targetcode.";
							break;
						case "targetCodeNotSet":
							message = "Please enter a targetcode.";
							break;
						case "targetCodeTooLong":
							message = "Targetcode must not contain more than 8 characters.";
							break;
						case "targetCodeNotAlphaNumeric":
							message = "Targetcode can only contain (english) letters in lower and upper case as well as digits.";
							break;
						case "internalNameTooLong":
							message = "Internal name must not contain more than 60 characters.";
							break;
						case "internalNameNotSet":
							message = "Please enter an internal name.";
							break;
						case "internalNameNotAlphaNumeric":
							message = "Internal name can only contain (english) letters in lower and upper case as well as digits.";
							break;
						case "noOrTooManyContactNumbers":
							message = "A campaign target must contain at least 1 and at most 50000 contact numbers.";
							break;
						case "samSuccess":
							message = "Your target was successfully created.";
							break;
						case "samError":
							message = "There was an issue during the target creation."
							break;
					}
				}else if(languageChoice == "FR"){
					switch(type){
						case "success":
							message = "La cible a été créée.";
							break;
						case "noSegmentName":
							message = "Indiquez un code cible.";
							break;
						case "buttonText":
							message = "Exporter la cible vers SAM";
							break;
						case "targetCodeNotAvailable":
							message = "Ce code cible est déjà utilisé. Veuillez choisir un autre code cible.";
							break;
						case "targetCodeNotSet":
							message = "Introduisez le code cible.";
							break;
						case "targetCodeTooLong":
							message = "Le code cible peut contenir 8 charactères au maximum.";
							break;
						case "targetCodeNotAlphaNumeric":
							message = "Le code cible peut contenir seulement des majuscules et minuscules (des lettres anglaises) aussi bien que des numéros.";
							break;
						case "internalNameTooLong":
							message = "Le nom interne peut contenir 60 charactères au maximum.";
							break;
						case "internalNameNotSet":
							message = "Introduisez un nom interne.";
							break;
						case "internalNameNotAlphaNumeric":
							message = "Internal name peut contenir seulement des majuscules et minuscules (des lettres anglaises) aussi bien que des numéros.";
							break;
						case "noOrTooManyContactNumbers":
							message = "Une cible d’une campagne doit contenir entre 1 et 50.000 numéros de contact.";
							break;
						case "samSuccess":
							message = "Votre cible a été créée avec succès.";
							break;
						case "samError":
							message = "Votre cible n’a pas pu être créée."
							break;
					}
				}else if(languageChoice == "ES"){
					switch(type){
						case "success":
							message = "El objetivo se creó.";
							break;
						case "noSegmentName":
							message = "Indique un código de objetivo.";
							break;
						case "buttonText":
							message = "Crear un objetivo con números de contacto."
							break;
						case "targetCodeNotAvailable":
							message = "El Código de objetivo ya está en uso. Escoja otro código de objetivo.";
							break;
						case "targetCodeNotSet":
							message = "Introduzca el código de objetivo.";
							break;
						case "targetCodeTooLong":
							message = "El código de objetivo puede consistir en 8 caracteres como máximo.";
							break;
						case "targetCodeNotAlphaNumeric":
							message = "El código de objetivo puede contener tanto mayúsculos y minúsculos (de letras ingleses) como números.";
							break;
						case "internalNameTooLong":
							message = "El nombre interno puede contener 60 caracteres como máximo.";
							break;
						case "internalNameNotSet":
							message = "Introduzca un nombre interno.";
							break;
						case "internalNameNotAlphaNumeric":
							message = "El nombre interno puede contener tanto mayúsculos y minúsculos (de letras ingleses) como números.";
							break;
						case "noOrTooManyContactNumbers":
							message = "Un objetivo de campaña debe incluir entre 1 y 50 000 números de contacto.";
							break;
						case "samSuccess":
							message = "Your target was successfully created.";
							break;
						case "samError":
							message = "There was an issue during the target creation."
							break;
					}
				}
				return message;
			}
			
			function randomInRange(start,end){
				return Math.floor(Math.random() * (end - start + 1) + start);
			}
			function createHyperCube(organization, targetCode, internalName) {
				console.log("createHyperCube() called for targetCode: " + targetCode + ", internalName: " + internalName);
				
				qlik.currApp().createCube({
					qDimensions : [{
						qDef : {
							qFieldDefs : ["CONTACT_NUMBER"]
						}
						}],
						qMeasures : [{
							
							qDef : {
								qDef : "javaPlugin.post('"+organization+","+targetCode+","+internalName+",'&"+"if($(f_Kunden_Anzahl_Ausschluss) > 0, only(CONTACT_NUMBER)))"
							}							
						}],
						qInitialDataFetch : [{
							qTop : 0,
							qLeft : 0,
							qHeight : 20,
							qWidth : 3
						}]
					}, cleanUp
					)

				// callback
				function cleanUp (reply) {
					console.log("Callback function cleanUp() called.");
					var responseMessage = reply.qHyperCube.qDataPages[0].qMatrix[0][1].qText;
					console.log("Response received: " + responseMessage);
					if(responseMessage.includes("success")){
						alert(getMessage(layout.props.languageChoice,"samSuccess"));
					}else{
						alert(getMessage(layout.props.languageChoice,"samError"));
					}
					console.log("Destroying the session object with the qId " + reply.qInfo.qId);
					qlik.currApp().destroySessionObject(reply.qInfo.qId);	
				}
				
			}  //end of createHyperCube()
			
			
				
		}
	
	};

} );

