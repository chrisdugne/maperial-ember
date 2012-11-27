

function renderTryscreenUI()
{
	$("#tryButton").hide();
	
	renderColorBar();
	renderStyle();
	initColorPicker();
	
	renderMap();
	$(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
}

function cleanTryscreenUI()
{
	cleanColorBar();
	cleanStyle();
	cleanColorPicker();
	cleanMap();
	
	$("#tryButton").show();
}
