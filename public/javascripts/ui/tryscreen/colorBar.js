
function renderColorBar()
{
	$(".tryscreenpopup.colorbar").dialogr({position : [80,110], zIndex: 3});
	$(".tryscreenpopup.colorbar").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
	
	$("#colorpickerColorbar").colorpicker();
}

function cleanColorBar()
{
	$(".tryscreenpopup.colorbar").dialogr("close");
}