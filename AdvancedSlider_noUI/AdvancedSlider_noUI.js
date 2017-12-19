define( [
		"qlik",
		"./properties",
		"./initialproperties",
		"jquery",
		'text!./css/nouislider.min.css',
		'./js/nouislider.min',
		'./js/wnumb-1.1.0/wNumb'
	],
	function ( qlik, props, initprops, $,noUISliderCSS,noUiSlider,wNumb) {
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
			//set the variable to the last known selected value
			qlik.currApp().variable.setStringValue(layout.props.variable, layout.props.selectedValue);
			var html='<br/><br/><br/><div id="slider" style="float:none;"></div>';
			$element.html(html);
			
			var slider = document.getElementById('slider');
			
			noUiSlider.create(slider, {
				start: [layout.props.selectedValue],
				connect: true,
				range: {
					'min': parseInt(layout.props.minValue),
					'max': parseInt(layout.props.maxValue)
				},
				step: parseInt(layout.props.steps),
				tooltips: wNumb({ decimals: 0 }),
				pips: { // Show a scale with the slider
					mode: 'count',
					stepped: true,
					density: parseInt(layout.props.pipsDensity),
					values: parseInt(layout.props.nrOfPipsValues)
				}
			});
			
			slider.noUiSlider.on('change', function(values, handle){
				layout.props.selectedValue =values[handle];
				qlik.currApp().variable.setStringValue(layout.props.variable, layout.props.selectedValue);
			});
			
			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );

