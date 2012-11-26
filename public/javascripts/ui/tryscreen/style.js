
function renderStyle()
{
	$(".tryscreenpopup.style").dialogr({position : [80,410]});
	$(".tryscreenpopup.style").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);

	$("#colorpickerStyle").colorpicker();
	$("#colorpickerStyle").css("z-index", 1222);
}

function cleanStyle()
{
	$(".tryscreenpopup.style").dialogr("close");
}