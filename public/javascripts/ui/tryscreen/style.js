
function renderStyle()
{
	$(".tryscreenpopup.style").dialogr({position : [80,410]});
	$(".tryscreenpopup.style").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);

	$(".colorpickerStyle").colorpicker();
}

function cleanStyle()
{
	$(".tryscreenpopup.style").dialogr("close");
}