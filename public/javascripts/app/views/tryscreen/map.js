

function renderMap()
{
	var maps = new GLMap ( "map" );
	maps.Start();

	$("#map").css("height", $("#webappDiv").height() );
	$("#map").css("width", $("#webappDiv").width() );
}

function cleanMap()
{
	$("#map").remove();
}