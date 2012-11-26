
function renderStyle()
{
	$("#style").dialogr({
		position : [80,410],
		closeOnEscape: false,
		dialogClass: 'no-close'
	});
}

function cleanStyle()
{
	$("#style").remove();
}