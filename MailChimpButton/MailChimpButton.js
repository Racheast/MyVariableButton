define( [
		"qlik",
		"./properties",
		'text!./style.css',
		"jquery"
	],
	function ( qlik, props, cssContent, $) {

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
			var html = '<div><button type="submit" id="b1" >do something</button></div>';
			
			var segment = {
				"name" : "myJSsegment",
				"static_segment" : []
			};				
			
			var members_to_add = ["mmmuster@mustermail.ed","ssspiderman@spinne.ed"];
			var members_to_remove = [];
			
			//USEFUL !!!
			//https://community.qlik.com/blogs/qlikviewdesignblog/2016/10/14/getting-all-data-cells-from-appcreatecube
			
			$element.html(html);  //works only in paint()
			
			$("#b1").click(function(){
				console.log("trying post...");
				
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
								var emailaddress = page[0].qLeft[j].qSubNodes[0].qSubNodes[0].qSubNodes[0].qSubNodes[0].qSubNodes[0].qSubNodes[0].qText;
								if(emailaddress != "-"){
									emailaddresses.push(emailaddress);
								}
							}
						}
						
						return emailaddresses;
					}).then((emailaddresses) => {  //send to MailChimpRestProxy
						console.log("Starting ajax call... (only createSegment atm)");
						createSegment(segment, emailaddresses);
					});
				});
				
			});
			
			function createSegment(segment, emailaddresses){
				console.log("Calling createSegment...");
				$.ajax({
					url: 'http://localhost:8887/createSegment?vApiPrefix=us13&baseURL=.api.mailchimp.com/3.0/&vMCKey=e0efd872132071dee9ba6c0eb6067e8d&vMCList=8af007a903',
					type: 'post',
					data: JSON.stringify(segment),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					dataType: 'json',
					success: function(data) {
						var segmentID = data.id;
						var membersToAddAndRemove = {
							"members_to_add" : emailaddresses,
							"members_to_remove" : []
						}
						addOrRemoveMembersFromSegment(membersToAddAndRemove, segmentID);
					}
				});
			}
			
			// !!! MAKE SURE THAT THE EMAIL-ADDRESSES BELONG TO USERS THAT EXIST IN MAILCHIMP !!!
			function addOrRemoveMembersFromSegment(membersToAddAndRemove, segmentID){
				console.log("Calling addOrRemoveMembersFromSegment...");
				$.ajax({
					url: 'http://localhost:8887/addOrRemoveMembersFromSegment?vApiPrefix=us13&baseURL=.api.mailchimp.com/3.0/&vMCKey=e0efd872132071dee9ba6c0eb6067e8d&vMCList=8af007a903&segment_id='+segmentID,
					type: 'post',
					data: JSON.stringify(membersToAddAndRemove),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					dataType: 'json',
					success: function(data) {
						console.log("Success: " + JSON.stringify(data));
					}
				});
			}
			
			//create segment
			//POST https://us13.api.mailchimp.com/3.0/lists/8af007a903/segments
			//addOrRemoveMembers to created segment
			//POST https://us13.api.mailchimp.com/3.0/lists/8af007a903/segments/<segmentID>
			
			/*
			$(document).ready(function(){

				$.post('localhost:5000/registrar', {
				  "enrollId": "jim",
				  "enrollSecret": "6avZQLwcUe9b"
				}, function(serverResponse){

				//do what you want with server response

				})

			})
			*/
			
			//needed for export
			//return qlik.Promise.resolve();
		}
	};

} );

