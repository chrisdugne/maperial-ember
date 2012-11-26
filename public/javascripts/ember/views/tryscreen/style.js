
function renderStyle()
{
	$("#style").dialogr({
		position : [80,410],
		dialogClass: 'no-close'
	});
	
	$("#style").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
}

function cleanStyle()
{
	$("#style").remove();
}