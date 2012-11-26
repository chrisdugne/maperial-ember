
var divEdited;

function renderTryscreenUI()
{
	$("#tryButton").hide();
	
	renderColorBar();
	renderStyle();
	renderMap();
	
	$("#colorpicker").dialogr({
		position : [380,210],
		closeOnEscape: false,
		dialogClass: 'no-close',
		autoOpen: false,
		show: {effect: 'fade', duration: 250},
		hide: {effect: 'fade', duration: 250}
	});

	$(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
}

function cleanTryscreenUI()
{
	cleanColorBar();
	cleanStyle();
	cleanMap();
	
	$("#colorpicker").remove();
	$("#tryButton").show();
}

function openColorPicker(div)
{
	divEdited = div.id;
	var position = $("#"+divEdited).offset();

	$("#colorpicker").html("<div id=\"picker\"></div>")
					 .dialogr('option', 'title', 'Color')
					 .dialogr('option', 'width', 300)
					 .dialogr('option', 'height', 380)
					 .dialogr('option', 'position', [position.left, position.top])
					 .dialogr("open");

	$("#picker").colorpicker({color:rgb2hex(div.style.backgroundColor)})
	.on('change.color', function(evt, color){
		$('#'+divEdited).attr('style','background-color:'+color);
		$("#colorpicker").dialogr("close");
	});
}