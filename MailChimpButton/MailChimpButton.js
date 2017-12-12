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
			
			var html = '<div><input type="text" id="segmentName" placeholder="Segmentname" style="width:40%"></div>';
			html += '<div><button type="submit" id="addToSegment" style="width:40%">' + getMessage(layout.props.languageChoice, "buttonText") + '</button></div>';
			//html += '<div id="dialog" title="Basic dialog"><p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the "x" icon.</p></div>';
			//html += '<div><button type="submit" id="addUpdateUsers" >Add/update users to a list</button></div>';
			//html += '<div><button type="submit" id="getSomething" >get something</button></div>';
							
			
			//USEFUL !!!
			//https://community.qlik.com/blogs/qlikviewdesignblog/2016/10/14/getting-all-data-cells-from-appcreatecube
			
			$element.html(html);  //works only in paint()
			
			function getMessage(languageChoice, type){
				var message = "";
				if(languageChoice == "DE"){
					switch(type){
						case "success":
							message = "Segment wurde erstellt.";
							break;
						case "noSegmentName":
							message = "Bitte geben Sie einen Segmentnamen an.";
							break;
						case "buttonText":
							message = "Segment mit Email-Adressen erstellen"
							break;
					}
				}else if(languageChoice == "EN"){
					switch(type){
						case "success":
							message = "Segment has been created.";
							break;
						case "noSegmentName":
							message = "Please enter a segment name.";
							break;
						case "buttonText":
							message = "create segment with email-addresses";
							break;
					}
				}
				return message;
			}
			
			$("#addToSegment").click(function(){
				console.log("trying post...");
				var segmentName = $("#segmentName").val();
				
				if(segmentName.length != 0){	
					var segment = {
						"name" : segmentName,
						"static_segment" : []
					};
					
					//NICE-TO-HAVE: AppObject-picker for dynamically selecting the table (like in SetObjectState)			
					qlik.currApp().getObject('dzJ').then(function(model){
						var totalheight = model.layout.qHyperCube.qSize.qcy;  
						var pageheight = 500;
						var nrOfPages = Math.ceil(totalheight/pageheight);					
						var tasks = [];
						var emailaddresses = [];
						
						for(var i=0; i < nrOfPages; i++){
							console.log("Creating page ...");
							var page = {
								qTop: i * pageheight, 
								qWidth: 20, 
								qLeft: 0, 
								qHeight: pageheight
							};
							tasks.push(model.getHyperCubePivotData('/qHyperCubeDef', [page]));
						}
						
						Promise.all(tasks).then((pages) => {
							
							for(var i=0; i < pages.length; i++){
								var page = pages[i];
								for(var j=0; j < page[0].qLeft.length; j++){
									var email_address = page[0].qLeft[j].qSubNodes[0].qSubNodes[0].qSubNodes[0].qSubNodes[0].qSubNodes[0].qSubNodes[0].qText;
									if(email_address != "-"){
										emailaddresses.push(email_address);
									}
								}
							}
							
							return emailaddresses;
						}).then((emailaddresses) => {  //send to MailChimpRestProxy
							
							createSegment(segment, emailaddresses);
						});
					});
				}else{
					alert("Please enter a segment name.");
				}
			});
			/* WORKING CODE: UNUSED ATM 
			$("#addUpdateUsers").click(function(){
				//NICE-TO-HAVE: AppObject-picker for dynamically selecting the table (like in SetObjectState)			
				qlik.currApp().getObject('dzJ').then(function(model){
					var totalheight = model.layout.qHyperCube.qSize.qcy;  
					var pageheight = 500;
					var nrOfPages = Math.ceil(totalheight/pageheight);					
					var tasks = [];
					//var emailaddresses = [];
					var members = [];
					
					for(var i=0; i < nrOfPages; i++){
						console.log("Creating page ...");
						var page = {
							qTop: i * pageheight, 
							qWidth: 20, 
							qLeft: 0, 
							qHeight: pageheight
						};
						tasks.push(model.getHyperCubePivotData('/qHyperCubeDef', [page]));
					}
					
					Promise.all(tasks).then((pages) => {
						for(var i=0; i < pages.length; i++){
							var page = pages[i];
							for(var j=0; j < page[0].qLeft.length; j++){
								var lastname = page[0].qLeft[j].qSubNodes[0].qText;
								var firstname = page[0].qLeft[j].qSubNodes[0].qSubNodes[0].qText;
								var city = page[0].qLeft[j].qSubNodes[0].qSubNodes[0].qSubNodes[0].qText;
								var zipcode = page[0].qLeft[j].qSubNodes[0].qSubNodes[0].qSubNodes[0].qSubNodes[0].qText;
								var address = page[0].qLeft[j].qSubNodes[0].qSubNodes[0].qSubNodes[0].qSubNodes[0].qSubNodes[0].qText;
								var email_address = page[0].qLeft[j].qSubNodes[0].qSubNodes[0].qSubNodes[0].qSubNodes[0].qSubNodes[0].qSubNodes[0].qText;
								
								 // !!! REPLACE THIS WITH DYNAMIC CODE !!!
								var status_if_new = "subscribed";
								if(email_address != "-"){
									var member = {
										"email_address" : email_address,
										"merge_fields" : {"FNAME" : firstname, "LNAME" : lastname},
										"status_if_new" : status_if_new 
									};
									console.log("MemberDto:\n" + JSON.stringify(member) + "\n\n");
									members.push(member);
								}
							}
						}
						
						return members;
					}).then((members) => {
						addOrUpdateListMembers(members);
					});
					
				});
			});
			
			$("#getSomething").click(function(){
				$.ajax({
					url: 'http://localhost:8887/getMemberFromList?vApiPrefix=us13&baseURL=.api.mailchimp.com/3.0/&vMCKey=e0efd872132071dee9ba6c0eb6067e8d&vMCList=8af007a903&email_address=b4kbn58k5bblr4@jmf7z8fgonq.com&batch_id=b0e770e5d9',
					type: 'get',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					dataType: 'json',
					success: function(data) {
						console.log("SUCCESS: data: \n" + JSON.stringify(data));
					}
				});
			});
			
			
			
			function addOrUpdateListMembers(members){
				console.log("Calling addMembersToList...");
				$.ajax({
					url: 'http://localhost:8887/addOrUpdateListMembers?vApiPrefix=us13&baseURL=.api.mailchimp.com/3.0/&vMCKey=e0efd872132071dee9ba6c0eb6067e8d&vMCList=8af007a903',
					type: 'post',
					data: JSON.stringify(members),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					dataType: 'json',
					success: function(data) {
						console.log("SUCCESS: Data: \n" + JSON.stringify(data));
					}
				});
			}
			*/
			
			function createSegment(segment, emailaddresses){
				console.log("Calling createSegment...");
				$.ajax({
					url: 'http://localhost:8887/createSegment?vApiPrefix=us13&baseURL=.api.mailchimp.com/3.0/&vMCKey=e0efd872132071dee9ba6c0eb6067e8d&vMCList=8af007a903',
					//url: 'http://zwirn:8887/createSegment?vApiPrefix=us13&baseURL=.api.mailchimp.com/3.0/&vMCKey=e0efd872132071dee9ba6c0eb6067e8d&vMCList=8af007a903',
					type: 'post',
					data: JSON.stringify(segment),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					dataType: 'json',
					success: function(data) {
						console.log("createSegment: SUCCESS: data: " + JSON.stringify(data));
						alert(getMessage(layout.props.languageChoice,"success"));
						var segmentID = data.id;
						var membersToAddAndRemove = {
							"members_to_add" : emailaddresses,
							"members_to_remove" : []
						}
						addOrRemoveMembersFromSegment(membersToAddAndRemove, segmentID);
					},
					error: function(data) {
						console.log("Data.statustext: " + data.statusText);
						alert(data.statusText);
					}
				});
			};
			
			// !!! MAKE SURE THAT THE EMAIL-ADDRESSES BELONG TO USERS THAT EXIST IN MAILCHIMP !!!
			function addOrRemoveMembersFromSegment(membersToAddAndRemove, segmentID){
				console.log("Calling addOrRemoveMembersFromSegment...");
				$.ajax({
					url: 'http://localhost:8887/addOrRemoveMembersFromSegment?vApiPrefix=us13&baseURL=.api.mailchimp.com/3.0/&vMCKey=e0efd872132071dee9ba6c0eb6067e8d&vMCList=8af007a903&segment_id='+segmentID,
					//url: 'http://zwirn:8887/addOrRemoveMembersFromSegment?vApiPrefix=us13&baseURL=.api.mailchimp.com/3.0/&vMCKey=e0efd872132071dee9ba6c0eb6067e8d&vMCList=8af007a903&segment_id='+segmentID,
					type: 'post',
					data: JSON.stringify(membersToAddAndRemove),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					dataType: 'json',
					success: function(data) {
						alert(data.total_added + " members have been added to the segment.");
					}
				});
			}
		}
	};

} );

