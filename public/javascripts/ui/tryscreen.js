
function renderTryscreenUI()
{
	$("#tryButton").hide();
	
	renderColorBar();
	renderStyle();
	renderMap();
}

function cleanTryscreenUI()
{
	cleanColorBar();
	cleanStyle();
	cleanMap();

	$("#tryButton").show();
}