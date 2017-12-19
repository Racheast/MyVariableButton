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
			//set the variables to their last known selected values
			qlik.currApp().variable.setStringValue(layout.props.variableLowerBound, layout.props.selectedValueLowerBound + "");
			qlik.currApp().variable.setStringValue(layout.props.variableUpperBound, layout.props.selectedValueUpperBound + "");
			
			var html='<br/><br/><br/><div id="slider" style="width:90%;margin-left:5%;"></div>';
			$element.html(html);
			var slider = document.getElementById('slider');
			
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