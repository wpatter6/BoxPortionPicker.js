# BoxPortionPicker.js
JQuery plugin that allows portions to be selected visually using boxes.

Here is the quick and dirty list of options that can be passed in during initialization and their defaults:

		addBreaks: true,
		cellCss:{},
		cellHtml: "&nbsp;",//use {0} to insert the cell number into the html string
		cellMargin: 1,
        cells: 4,
		clickSelectedCellToClear: true,
		columns: 0,
		elementType: "div",
		maxCellHeight: 500,
		maxCellWidth: 500,
		minCellHeight: 5,
		minCellWidth: 5,
		selected: 0,//which item is selected by default
		selectedClass: null,
		selectedColor: "#88CC00",
		unselectedClass: null,
		unselectedColor: "#BBE6BB"

And here are methods that can be accessed via $(element).data("tableMultiPicker")

      selectCell(num, triggerEvent);
      clearSelection(triggerEvent);
      get_selected();
      get_percentage();
      get_percentageText();
