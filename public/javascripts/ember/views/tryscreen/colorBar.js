
function renderColorBar()
{
	$("#colorbar").dialogr({
		position : [80,110],
		dialogClass: 'no-close'
	});
	
	$("#colorbar").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
}

function cleanColorBar()
{
	$("#colorbar").remove();
}