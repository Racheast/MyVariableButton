define( [
		"qlik",
		"./properties",
		"./initialproperties",
		'text!./style.css',
		"jquery",
		'text!./js/jquery-ui-1.12.1.custom/jquery-ui.css',
		'./js/jquery-ui-1.12.1.custom/jquery-ui'
	],
	function ( qlik, props, initprops, cssContent, $ , jqueryUIcss, jqueryUI) {
		$("<style>").html(cssContent).appendTo("head");
		$("<style>").html(jqueryUIcss).appendTo("head");
	return {
		definition:props,
		initialproperties: initprops,
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		paint: function ($element, layout) {
			var html = "", id = layout.qInfo.qId, nrOfSteps = 0.01;
			
			if(layout.props.intOrDec == false){
				nrOfSteps = 1;
			}
			
			qlik.currApp().variable.setStringValue(layout.props.variableLowerBound, layout.props.selectedValueLowerBound + "");
			qlik.currApp().variable.setStringValue(layout.props.variableUpperBound, layout.props.selectedValueUpperBound + "");
			
			$( function() {
				$( "#slider-range" ).slider({
					  range: true,
					  min: layout.props.minValue + 1 - 1,  /* + 1 - 1 needed for proper slider-formatting (don't know why atm ... xD)*/
					  max: layout.props.maxValue,
					  values: [ layout.props.selectedValueLowerBound, layout.props.selectedValueUpperBound  ],
					  slide: function( event, ui ){
						$( "#amount" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
					  },
					  change: function( event, ui ) {
						layout.props.selectedValueLowerBound = $( "#slider-range" ).slider( "values", 0 ) + "";
						qlik.currApp().variable.setStringValue(layout.props.variableLowerBound, layout.props.selectedValueLowerBound);
						 
						layout.props.selectedValueUpperBound = $( "#slider-range" ).slider( "values", 1 ) + "";
						qlik.currApp().variable.setStringValue(layout.props.variableUpperBound, layout.props.selectedValueUpperBound);
					  }
				});
				$( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) +
				  " - " + $( "#slider-range" ).slider( "values", 1 ) );
				 
			});
			
			
			html += '<p>'
			html +=	'<label for="amount"></label>';
			html +=	'<input type="text" id="amount" readonly style="border:0; color:#f6931f; font-weight:bold;">';
			html +=	'</p>';
			html += '<div id="slider-range"></div>';
			
			$element.html(html);
			
			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );