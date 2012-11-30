

function renderMap()
{
	var maps = new GLMap ( "map" );
	maps.Start();

	$("#testMap").css("height", $("#webappDiv").height() );
	$("#testMap").css("width", $("#webappDiv").width() );
}

function cleanMap()
{
	$("#map").remove();
}