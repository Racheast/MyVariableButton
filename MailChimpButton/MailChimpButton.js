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
					   qWidth : 8,  
					   qHeight : 50  
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
			
			var segment = JSON.stringify({
				"name" : "myJSsegment",
				"static_segment" : []
			});				
			
			var members_to_add = ["mmmuster@mustermail.ed","ssspiderman@spinne.ed"];
			var members_to_remove = [];
			
			
			
			qlik.currApp().getObject('dzJ').then(function(model){
				var table = qlik.table(model);  
				/*works only, if I want to download it manually...
				table.exportData({format: "OOXML", download: true});
				*/
				
				/*!!!
				Gain access to email-addresses over the subnode-architecture.
				Make sure to receive all rows (not only e.g.50)
				*/
				
				console.log("model.layout: " + JSON.stringify(model.layout.qHyperCube.qPivotDataPages[0].qLeft[9]));
				console.log("table.rowCount: " + table.rowCount);
				console.log("table.rows: " + table.rows);
 
			
				
			});
			
			$element.html(html);
			
			$("#b1").click(function(){
				console.log("trying post...");
				//base_url,vMCKey,vApiPrefix,vMCList
				//https://us13.api.mailchimp.com/3.0/,e0efd872132071dee9ba6c0eb6067e8d,us13,8af007a903
				/*
				$.post('http://localhost:51961/createSegment?vApiPrefix=us13&baseURL=.api.mailchimp.com/3.0/&vMCKey=e0efd872132071dee9ba6c0eb6067e8d&vMCList=8af007a903',segment,function(serverResponse){
					console.log("server response: " + serverResponse);
				});
				*/
				/*
				console.log(segment);
				$.ajax({
					url: 'http://localhost:8887/createSegment?vApiPrefix=us13&baseURL=.api.mailchimp.com/3.0/&vMCKey=e0efd872132071dee9ba6c0eb6067e8d&vMCList=8af007a903',
					type: 'post',
					data: segment,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					dataType: 'json',
					success: function (data) {
						console.log("success: " + data);
					}
				});
				*/
				
			});
			
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

