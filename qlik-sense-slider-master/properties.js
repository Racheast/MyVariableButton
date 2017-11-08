define([], function(){

  return {
    type: "items",
    component: "accordion",
    items: {
      settings: {
        uses: "settings",
        items: {
          sliderSettingsHeader: {
            type: "items",
            label: "Slider Settings",
            items: {
              varlable: {
                ref: "props.variable",
                label: "Variable",
                type: "string",
                defaultValue: "Variable1"
              },
              minValue: {
                ref: "props.minValue",
                label: "Minimum Value",
                type: "string",
                defaultValue: "0"
              },
              maxValue: {
                ref: "props.maxValue",
                label: "Maximum Value",
                type: "string",
                defaultValue: "100"
              },
              /*
			  step: {
                ref: "props.sliderStep",
                label: "Slider Step",
                type: "string",
                defaultValue: "0.01"
              },
			  */
              /*
			  defaultValue: {
                ref: "props.defaultValue",
                label: "Default Value",
                type: "string",
                defaultValue: "50"
              },
			  */
              label: {
                ref: "props.label",
                label: "Reset Button Label",
                type: "string",
                defaultValue: "Reset"
              },
			  nrOfPartitions: {
                ref: "props.nrOfPartitions",
                label: "Nr. of partitions",
                type: "string",
                defaultValue: "5"
              },
			  partitionWarning: {
				label: "Warning! Partitions may be displayed wrongly if integer-mode is on.",
				component: "text"
			  },
			  intOrDec: {
				type: "boolean",
				component: "switch",
				label: "integer / decimal",
				ref: "props.intOrDec",
				options: [{
					value: true,
					label: "decimal"
				}, {
					value: false,
					label: "integer"
				}],
				defaultValue: true
			  },
			  selectedValue: {
				ref: "props.selectedValue",
				label: "Selected Value",
				type: "string",
				defaultValue: "50"
			  }
            }
          }
        }
      }
    }
  }
});
