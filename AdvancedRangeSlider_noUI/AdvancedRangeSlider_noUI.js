define( [
		"qlik",
		"./properties",
		"./initialproperties",
		"jquery",
		'text!./css/nouislider.min.css',
		'./js/nouislider.min',
		'./js/wnumb-1.1.0/wNumb'
	],
	function ( qlik, props, initprops, $,noUISliderCSS,noUiSlider,wNumb ) {
		$("<style>").html(noUISliderCSS).appendTo("head");
	return {
		definition:props,
		initialproperties: initprops,
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		paint: function ($element, layout) {
			var html="";
			var slider_id = "advancedRangeSlider_1";
			var hidden_field = document.getElementById("hidden_id_advancedRangeSlider");
			
			//generate the slider_id for this particular slider
			if(hidden_field == undefined){
				html = '<input type="hidden" id="hidden_id_advancedRangeSlider" value=advancedRangeSlider_1></input><br/>'
			}else{
				var nr=hidden_field.value.substring(hidden_field.value.lastIndexOf("_") + 1);
				nr++;
				slider_id = "advancedRangeSlider_" + nr;
				document.getElementById("hidden_id_advancedRangeSlider").value=slider_id;
			}
			
			//set the variables to their last known selected values
			qlik.currApp().variable.setStringValue(layout.props.variableLowerBound, layout.props.selectedValueLowerBound + "");
			qlik.currApp().variable.setStringValue(layout.props.variableUpperBound, layout.props.selectedValueUpperBound + "");
			
			html = html + '<br/><br/><br/><div id="'+slider_id+'" style="width:90%;margin-left:5%;"></div>';
			$element.html(html);
			
			var slider = document.getElementById(slider_id);
			
			noUiSlider.create(slider, {
				start: [layout.props.selectedValueLowerBound, layout.props.selectedValueUpperBound],
				connect: true,
				range: {
					'min': parseInt(layout.props.minValue),
					'max': parseInt(layout.props.maxValue)
				},
				step: parseInt(layout.props.steps),
				tooltips: [ wNumb({ decimals: 0 }), wNumb({ decimals: 0 }) ],
				pips: { // Show a scale with the slider
					mode: 'count',
					stepped: true,
					density: parseInt(layout.props.pipsDensity),
					values: parseInt(layout.props.nrOfPipsValues)
				}
			});
			
			slider.noUiSlider.on('change', function(values, handle){
				if(handle == 0){  //lower value
					layout.props.selectedValueLowerBound = values[handle];
					qlik.currApp().variable.setStringValue(layout.props.variableLowerBound, layout.props.selectedValueLowerBound);
				}else if(handle == 1){  //upper value
					layout.props.selectedValueUpperBound = values[handle];
					qlik.currApp().variable.setStringValue(layout.props.variableUpperBound, layout.props.selectedValueUpperBound);
				}
				
			});
			
			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );
