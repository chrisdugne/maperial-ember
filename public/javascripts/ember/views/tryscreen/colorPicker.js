
function initColorPicker()
{
	$("#colorpicker").dialogr({
		position : [380,210],
		closeOnEscape: false,
		dialogClass: 'no-close',
		autoOpen: false,
		show: {effect: 'fade', duration: 250},
		hide: {effect: 'fade', duration: 250}
	});
}

function cleanColorPicker()
{
	$("#colorpicker").remove();
}


function openColorPicker(div)
{
	var position = $("#"+div.id).offset();
	var left = position.left;
	var top = position.top;

	$("#colorpicker").html("<div id=\"picker\"></div>")
					 .dialogr('option', 'title', 'Color')
					 .dialogr('option', 'width', 300)
					 .dialogr('option', 'height', 380)
					 .dialogr('option', 'position', [left, top])
					 .dialogr("open");

	$("#picker").colorpicker({color:rgb2hex(div.style.backgroundColor)})
	.on('change.color', function(evt, color){
		$('#'+div.id).attr('style','background-color:'+color);
		$("#colorpicker").dialogr("close");
	});
}