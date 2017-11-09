define( [
		"qlik",
		"./properties",
		"./initialproperties",
		'text!./style.css',
		"jquery"
	],
	function ( qlik, props, initprops, cssContent, $) {
		$("<style>").html(cssContent).appendTo("head");

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
			
			qlik.currApp().variable.setStringValue(layout.props.variable, layout.props.selectedValue);
			
			html += '<div id="qs-slider-ext-' + id + '">';
			html += 	'<div id ="labels"><span id="min-val">' + layout.props.minValue + '</span><span id="max-val">' + layout.props.maxValue + '</span></div>';
			html += 	'<input id="qs-slider-' + id + '" type="range" min="' + layout.props.minValue + '" max="' + layout.props.maxValue + '" step="' + nrOfSteps + '" style="width:95%" value="' + layout.props.selectedValue + '" list="tickmarks"/>';
			html += 	'<input type="text" id="textInput" value="">'
			html += '</div>';			
			html += printDatalist(layout.props.minValue, layout.props.maxValue, layout.props.nrOfPartitions);
			
			$element.html(html);
			
			updateTextField(layout.props.selectedValue);

			// Triggered by the slider.
			$('#qs-slider-' + id ).on('change', function() {
				layout.props.selectedValue = $(this).val();
				qlik.currApp().variable.setStringValue(layout.props.variable, layout.props.selectedValue);
				updateTextField(layout.props.selectedValue);
			})
			
			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );



function updateTextField(val){
	 document.getElementById('textInput').value=val; 
}

function printDatalist(minValue, maxValue, nrOfPartitions){
	var datalist="<datalist id=tickmarks>";
	var range = maxValue - minValue;
	var intervall = parseFloat(range / nrOfPartitions);
	var tickValue = minValue;
	if(nrOfPartitions > 0){
		for(var i=0; i<(nrOfPartitions-1); i++){
				tickValue = parseFloat(tickValue) + intervall;
				tickValue = Math.round(tickValue*100) / 100;
				datalist += "<option>" + tickValue + "</option>";
		}
	}
	datalist += "</datalist>";
	return datalist;
}
