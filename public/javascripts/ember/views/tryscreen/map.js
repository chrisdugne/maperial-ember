
function renderMap()
{
	console.log("renderMap");
	var mapOptions = {
	    zoom: 13,
	    center: new google.maps.LatLng(45.75, 3.15),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	var map = new google.maps.Map($("#map")[0], mapOptions);
	
	$("#map").css("height", $("#webapp").height() );
}

function cleanMap()
{
	$("#map").empty();
}